import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const out = resolve(root, "public");

// Embed VT323 as base64 so it renders in sharp/libvips
const fontB64 = readFileSync(resolve(root, "public/fonts/VT323-Regular.ttf")).toString("base64");
const fontFace = `@font-face { font-family: 'VT323'; src: url('data:font/truetype;base64,${fontB64}'); }`;

function wrap(content, w, h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><style>${fontFace}</style></defs>
  ${content}
</svg>`;
}

// ─── Asset definitions ───────────────────────────────────────────────────────

const MARK = (s = 256) => {
  const b = s * 0.03;   // border
  const t = s * 0.31;   // text y
  const by = s * 0.58;  // bar y
  const bh = s * 0.08;  // bar h
  const bw = s * 0.20;  // bar segment w
  const fs = s * 0.31;  // font size
  const sub = s * 0.11; // sub font size
  const ty = s * 0.85;  // tagline y
  return wrap(`
  <rect width="${s}" height="${s}" fill="#0a0a0a"/>
  <rect x="${b}" y="${b}" width="${s-b*2}" height="${s-b*2}" fill="none" stroke="#f0c040" stroke-width="${b}"/>
  <line x1="${b}" y1="${s*0.22}" x2="${s*0.22}" y2="${s*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${s*0.78}" y1="${s*0.22}" x2="${s-b}" y2="${s*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${b}" y1="${s*0.78}" x2="${s*0.22}" y2="${s*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${s*0.78}" y1="${s*0.78}" x2="${s-b}" y2="${s*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <text x="${s/2}" y="${t}" font-family="VT323,monospace" font-size="${fs}" fill="#f0c040" text-anchor="middle" letter-spacing="${s*0.04}">NBS</text>
  <rect x="${s*0.14}" y="${by}" width="${bw}" height="${bh}" fill="#f0c040"/>
  <rect x="${s*0.37}" y="${by}" width="${bw}" height="${bh}" fill="#f0c040"/>
  <rect x="${s*0.60}" y="${by}" width="${bw}" height="${bh}" fill="#39d353"/>
  <rect x="${s*0.82}" y="${by}" width="${s*0.07}" height="${bh}" fill="#39d353" opacity="0.4"/>
  <text x="${s/2}" y="${ty}" font-family="VT323,monospace" font-size="${sub}" fill="#555544" text-anchor="middle" letter-spacing="${s*0.02}">NO BUY STREAK</text>
  `, s, s);
};

const FULL_LOGO = (s = 512) => {
  const mw = s * 0.36;
  const mx = (s - mw) / 2;
  const my = s * 0.04;
  const b = mw * 0.03;
  const mh = mw;
  const tf = s * 0.15;
  const ty = my + mh + s * 0.08 + tf;
  const sf = s * 0.055;
  const sy = ty + s * 0.07;
  return wrap(`
  <rect width="${s}" height="${s}" fill="#0a0a0a"/>
  <!-- mark -->
  <rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="#0a0a0a"/>
  <rect x="${mx+b}" y="${my+b}" width="${mw-b*2}" height="${mh-b*2}" fill="none" stroke="#f0c040" stroke-width="${b}"/>
  <line x1="${mx+b}" y1="${my+mw*0.22}" x2="${mx+mw*0.22}" y2="${my+mw*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+mw*0.78}" y1="${my+mw*0.22}" x2="${mx+mw-b}" y2="${my+mw*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+b}" y1="${my+mw*0.78}" x2="${mx+mw*0.22}" y2="${my+mw*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+mw*0.78}" y1="${my+mw*0.78}" x2="${mx+mw-b}" y2="${my+mw*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <text x="${s/2}" y="${my+mw*0.59}" font-family="VT323,monospace" font-size="${mw*0.31}" fill="#f0c040" text-anchor="middle" letter-spacing="${mw*0.04}">NBS</text>
  <rect x="${mx+mw*0.14}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.37}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.60}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#39d353"/>
  <rect x="${mx+mw*0.82}" y="${my+mw*0.58}" width="${mw*0.07}" height="${mw*0.08}" fill="#39d353" opacity="0.4"/>
  <text x="${s/2}" y="${my+mw*0.85}" font-family="VT323,monospace" font-size="${mw*0.11}" fill="#555544" text-anchor="middle" letter-spacing="${mw*0.02}">NO BUY STREAK</text>
  <!-- wordmark -->
  <text x="${s/2}" y="${ty}" font-family="VT323,monospace" font-size="${tf}" fill="#f0c040" text-anchor="middle" letter-spacing="${s*0.015}">[No-BS]</text>
  <text x="${s/2}" y="${sy}" font-family="VT323,monospace" font-size="${sf}" fill="#555544" text-anchor="middle" letter-spacing="${s*0.015}">NO BUY STREAK</text>
  `, s, s);
};

const HORIZONTAL = (w = 800, h = 200) => {
  const mw = h * 0.82;
  const mx = h * 0.09;
  const my = (h - mw) / 2;
  const b = mw * 0.03;
  const tx = mx + mw + h * 0.12;
  const tf = h * 0.34;
  const ty = h * 0.48;
  const sf = h * 0.15;
  const sy = h * 0.73;
  return wrap(`
  <rect width="${w}" height="${h}" fill="#0a0a0a"/>
  <rect x="${mx}" y="${my}" width="${mw}" height="${mw}" fill="#0a0a0a"/>
  <rect x="${mx+b}" y="${my+b}" width="${mw-b*2}" height="${mw-b*2}" fill="none" stroke="#f0c040" stroke-width="${b}"/>
  <line x1="${mx+b}" y1="${my+mw*0.22}" x2="${mx+mw*0.22}" y2="${my+mw*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+mw*0.78}" y1="${my+mw*0.22}" x2="${mx+mw-b}" y2="${my+mw*0.22}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+b}" y1="${my+mw*0.78}" x2="${mx+mw*0.22}" y2="${my+mw*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <line x1="${mx+mw*0.78}" y1="${my+mw*0.78}" x2="${mx+mw-b}" y2="${my+mw*0.78}" stroke="#f0c040" stroke-width="${b*0.7}"/>
  <text x="${mx+mw/2}" y="${my+mw*0.59}" font-family="VT323,monospace" font-size="${mw*0.31}" fill="#f0c040" text-anchor="middle" letter-spacing="${mw*0.04}">NBS</text>
  <rect x="${mx+mw*0.14}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.37}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.60}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#39d353"/>
  <rect x="${mx+mw*0.82}" y="${my+mw*0.58}" width="${mw*0.07}" height="${mw*0.08}" fill="#39d353" opacity="0.4"/>
  <text x="${mx+mw/2}" y="${my+mw*0.85}" font-family="VT323,monospace" font-size="${mw*0.11}" fill="#555544" text-anchor="middle"  letter-spacing="${mw*0.01}">NO BUY STREAK</text>
  <text x="${tx}" y="${ty}" font-family="VT323,monospace" font-size="${tf}" fill="#f0c040" letter-spacing="4">[No-BS]</text>
  <text x="${tx}" y="${sy}" font-family="VT323,monospace" font-size="${sf}" fill="#555544" letter-spacing="3">NO BUY STREAK</text>
  `, w, h);
};

const WORDMARK = (w = 480, h = 120) => wrap(`
  <rect width="${w}" height="${h}" fill="#0a0a0a"/>
  <text x="${w/2}" y="${h*0.72}" font-family="VT323,monospace" font-size="${h*0.62}" fill="#f0c040" text-anchor="middle" letter-spacing="6">[No-BS]</text>
  <text x="${w/2}" y="${h*0.95}" font-family="VT323,monospace" font-size="${h*0.16}" fill="#555544" text-anchor="middle" letter-spacing="3">NO BUY STREAK</text>
`, w, h);

const BADGE = (label = "No-BS", w = 260, h = 72) => wrap(`
  <rect width="${w}" height="${h}" fill="#0a0a0a"/>
  <rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="#f0c040" stroke-width="3"/>
  <text x="${w/2}" y="${h*0.70}" font-family="VT323,monospace" font-size="${h*0.52}" fill="#f0c040" text-anchor="middle" letter-spacing="4">${label}</text>
`, w, h);

const BADGE_PRO = () => BADGE("★ PRO", 200, 72);

const OG_IMAGE = (w = 1200, h = 630) => {
  const mw = 200;
  const mx = 60;
  const my = (h - mw) / 2;
  const b = mw * 0.03;
  return wrap(`
  <rect width="${w}" height="${h}" fill="#0a0a0a"/>
  <!-- subtle grid lines -->
  <line x1="0" y1="${h*0.5}" x2="${w}" y2="${h*0.5}" stroke="#1a1a1a" stroke-width="1"/>
  <line x1="${w*0.5}" y1="0" x2="${w*0.5}" y2="${h}" stroke="#1a1a1a" stroke-width="1"/>
  <!-- amber border -->
  <rect x="20" y="20" width="${w-40}" height="${h-40}" fill="none" stroke="#2a2a2a" stroke-width="2"/>
  <!-- mark -->
  <rect x="${mx}" y="${my}" width="${mw}" height="${mw}" fill="#0a0a0a"/>
  <rect x="${mx+b}" y="${my+b}" width="${mw-b*2}" height="${mw-b*2}" fill="none" stroke="#f0c040" stroke-width="${b}"/>
  <text x="${mx+mw/2}" y="${my+mw*0.59}" font-family="VT323,monospace" font-size="${mw*0.31}" fill="#f0c040" text-anchor="middle" letter-spacing="${mw*0.04}">NBS</text>
  <rect x="${mx+mw*0.14}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.37}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#f0c040"/>
  <rect x="${mx+mw*0.60}" y="${my+mw*0.58}" width="${mw*0.20}" height="${mw*0.08}" fill="#39d353"/>
  <!-- headline -->
  <text x="${w/2+60}" y="${h*0.38}" font-family="VT323,monospace" font-size="110" fill="#f0c040" text-anchor="middle" letter-spacing="4">[No-BS]</text>
  <text x="${w/2+60}" y="${h*0.58}" font-family="VT323,monospace" font-size="36" fill="#c8c8b4" text-anchor="middle" letter-spacing="3">NO BUY STREAK</text>
  <text x="${w/2+60}" y="${h*0.76}" font-family="VT323,monospace" font-size="26" fill="#555544" text-anchor="middle" letter-spacing="2">Track. Resist. Win.</text>
  <!-- bottom bar -->
  <rect x="20" y="${h-52}" width="${w-40}" height="1" fill="#2a2a2a"/>
  <text x="60" y="${h-22}" font-family="VT323,monospace" font-size="22" fill="#555544" letter-spacing="2">nobuystreak.com</text>
  <text x="${w-60}" y="${h-22}" font-family="VT323,monospace" font-size="22" fill="#555544" text-anchor="end" letter-spacing="2">FREE TO START</text>
  `, w, h);
};

const FAVICON_LARGE = () => MARK(512);

// ─── Pixel icon ──────────────────────────────────────────────────────────────
const PIXEL_ICON = (s = 256) => {
  const cell = s / 8;
  const pixels = [
    [0,0,"#f0c040"],[0,1,"#f0c040"],[0,2,"#f0c040"],[0,3,"#f0c040"],
    [1,1,"#f0c040"],[2,2,"#f0c040"],
    [3,0,"#f0c040"],[3,1,"#f0c040"],[3,2,"#f0c040"],[3,3,"#f0c040"],
    [0,5,"#f0c040"],[1,5,"#f0c040"],[2,5,"#39d353"],[3,5,"#39d353"],
    [4,5,"#39d353"],[5,5,"#39d353"],[6,5,"#f0c040"],[7,5,"#f0c040"],
    [5,0,"#f0c040"],[6,0,"#f0c040"],
    [5,2,"#f0c040"],[6,2,"#f0c040"],[7,2,"#f0c040"],
    [5,3,"#f0c040"],[6,3,"#f0c040"],[7,3,"#f0c040"],
    [5,1,"#39d353"],[6,1,"#39d353"],[7,1,"#39d353"],
    [0,7,"#333322"],[7,7,"#333322"],
  ];
  const rects = pixels.map(([x, y, c]) =>
    `<rect x="${x*cell}" y="${y*cell}" width="${cell-1}" height="${cell-1}" fill="${c}"/>`
  ).join("\n  ");
  return wrap(`<rect width="${s}" height="${s}" fill="#0a0a0a"/>\n  ${rects}`, s, s);
};

// ─── Convert SVG → PNG ───────────────────────────────────────────────────────
async function toPng(svgString, filename, density = 144) {
  const buf = Buffer.from(svgString);
  await sharp(buf, { density })
    .png({ compressionLevel: 9 })
    .toFile(resolve(out, filename));
  console.log(`  ✓ ${filename}`);
}

// ─── Generate all ────────────────────────────────────────────────────────────
console.log("Generating PNGs...\n");

await toPng(MARK(512),        "logo-mark.png");
await toPng(MARK(192),        "logo-mark-192.png");
await toPng(MARK(64),         "logo-mark-64.png");
await toPng(FULL_LOGO(512),   "logo-full.png");
await toPng(HORIZONTAL(800,200), "logo-horizontal.png");
await toPng(WORDMARK(480,120), "logo-wordmark.png");
await toPng(BADGE("No-BS"),   "badge-no-bs.png");
await toPng(BADGE_PRO(),      "badge-pro.png");
await toPng(BADGE("[HELD]", 220, 72),  "badge-held.png");
await toPng(BADGE("[FREE]", 220, 72),  "badge-free.png");
await toPng(OG_IMAGE(),       "og-image.png", 96);
await toPng(FAVICON_LARGE(),  "logo-mark-512.png");
await toPng(PIXEL_ICON(256),  "pixel-icon.png");
await toPng(PIXEL_ICON(64),   "pixel-icon-64.png");

// Also write standalone SVGs alongside PNGs
const svgs = {
  "logo-mark.svg":       MARK(512),
  "logo-full.svg":       FULL_LOGO(512),
  "logo-horizontal.svg": HORIZONTAL(800,200),
  "logo-wordmark.svg":   WORDMARK(480,120),
  "badge-no-bs.svg":     BADGE("No-BS"),
  "badge-pro.svg":       BADGE_PRO(),
  "og-image.svg":        OG_IMAGE(),
  "pixel-icon.svg":      PIXEL_ICON(256),
};
for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(resolve(out, name), svg);
  console.log(`  ✓ ${name}`);
}

console.log("\nDone.");
