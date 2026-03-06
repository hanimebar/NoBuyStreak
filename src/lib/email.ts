import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM = "NoBuy Streak <reachout@actvli.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nobuystreak.actvli.com";

function retro(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="background:#0a0a0a;color:#c8c8b4;font-family:monospace;padding:32px 24px;margin:0;">
  <div style="max-width:480px;margin:0 auto;">
    <div style="border:1px solid #2a2a2a;padding:32px;">
      <p style="color:#555544;font-size:11px;letter-spacing:3px;margin:0 0 20px;">
        C:\\NOBUY&gt; message.exe
      </p>
      <p style="color:#f0c040;font-size:24px;font-weight:bold;margin:0 0 24px;letter-spacing:1px;">
        NOBUY STREAK
      </p>
      ${content}
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #2a2a2a;">
        <p style="color:#555544;font-size:11px;margin:0;">
          NOBUYSTREAK.ACTVLI.COM<br />
          <a href="${APP_URL}/privacy" style="color:#555544;">PRIVACY</a>
          &nbsp;·&nbsp;
          <a href="${APP_URL}/terms" style="color:#555544;">TERMS</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function line(text: string, color = "#c8c8b4", size = "14px") {
  return `<p style="color:${color};font-size:${size};margin:0 0 12px;">${text}</p>`;
}

function cta(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:8px;padding:10px 20px;border:1px solid #f0c040;color:#f0c040;text-decoration:none;font-size:14px;letter-spacing:1px;">${label}</a>`;
}

// ── Welcome email ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, ruleName: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "PLAYER 1 HAS ENTERED THE GAME — NoBuy Streak",
    html: retro(`
      ${line("&gt; NEW SAVE FILE CREATED.", "#39d353", "18px")}
      ${line("No spreadsheet. No sticky notes. No pretending it's a 'lifestyle' now.")}
      ${line("Your first rule is loaded and ready:")}
      ${line(`&gt; <strong style="color:#f0c040;">${ruleName}</strong>`)}
      ${line("Rules are simple: check in every day. HELD = streak lives. SLIPPED = streak resets. No participation trophies here.", "#888877")}
      ${line("Pro tip: log temptations too. Future you will enjoy seeing what almost broke you.", "#888877")}
      ${cta("[START YOUR RUN →]", `${APP_URL}/app/dashboard`)}
    `),
  });
}

// ── Pro upgrade email ─────────────────────────────────────────────────────────

export async function sendProUpgradeEmail(email: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "PRO UNLOCKED. Insert coin was a metaphor — NoBuy Streak",
    html: retro(`
      ${line("&gt; CHEAT CODE ACCEPTED.", "#39d353", "18px")}
      ${line("Just kidding. You paid for it fair and square. Welcome to Pro:")}
      ${line("&gt; Unlimited rules — because one bad habit is rarely the only one", "#c8c8b4")}
      ${line("&gt; Shareable streak cards — for flexing responsibly", "#c8c8b4")}
      ${line("&gt; 30-day lookback emails — haunted by your past temptations, weekly", "#c8c8b4")}
      ${line("No BS. No upsells. That's genuinely everything Pro gets you.", "#888877")}
      ${cta("[LET'S GO →]", `${APP_URL}/app/dashboard`)}
    `),
  });
}

// ── Subscription cancelled email ─────────────────────────────────────────────

export async function sendCancellationEmail(email: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "GAME OVER? Nah. — NoBuy Streak",
    html: retro(`
      ${line("&gt; PRO SUBSCRIPTION ENDED.", "#f0c040", "18px")}
      ${line("Your Pro plan is done. No hard feelings — we respect the no-spend energy.")}
      ${line("What's still yours on Free:")}
      ${line("&gt; Your streak history (untouched)", "#888877")}
      ${line("&gt; 1 active rule", "#888877")}
      ${line("&gt; Temptation log", "#888877")}
      ${line("What's gone:")}
      ${line("&gt; Extra rules (oldest one stays active)", "#555544")}
      ${line("&gt; Shareable cards", "#555544")}
      ${line("Come back when the vibe is right. Your data will be here.", "#888877")}
      ${cta("[CONTINUE ON FREE →]", `${APP_URL}/app/dashboard`)}
      &nbsp;
      ${cta("[RESUBSCRIBE →]", `${APP_URL}/pricing`)}
    `),
  });
}

// ── Streak milestone email ────────────────────────────────────────────────────

export async function sendMilestoneEmail(
  email: string,
  ruleName: string,
  days: number
) {
  const resend = getResend();

  const flavour: Record<number, { subject: string; headline: string; body: string }> = {
    7: {
      subject: `7-DAY STREAK — ${ruleName} (most people don't make it here)`,
      headline: "&gt; ACHIEVEMENT UNLOCKED: ONE WEEK.",
      body: "Most people bail by day 3. You're at 7. That's not luck — that's a decision you made every single morning this week.",
    },
    30: {
      subject: `30-DAY STREAK — ${ruleName} 🏆 that's a habit now`,
      headline: "&gt; 30 DAYS. HIGH SCORE TERRITORY.",
      body: "Science says 21 days to form a habit. You blew past that. At 30 days, this isn't willpower anymore — it's just who you are now.",
    },
    100: {
      subject: `100-DAY STREAK — ${ruleName} — certified no-buy legend`,
      headline: "&gt; 100 DAYS. ENTERING LEGEND MODE.",
      body: "Triple digits. You are statistically an anomaly. Most people who downloaded a habit app are using it as a coaster by now. Not you.",
    },
    365: {
      subject: `365-DAY STREAK — ${ruleName} 🎖️ ONE FULL YEAR`,
      headline: "&gt; 365 DAYS. ALL SAVE FILES CLEARED.",
      body: "A full year. We're not going to tell you what to do with this information. You know what it means. Quietly legendary.",
    },
  };

  const f = flavour[days] ?? {
    subject: `${days}-day streak — ${ruleName}`,
    headline: `&gt; ${days}-DAY STREAK. STILL GOING.`,
    body: `${days} days in. The algorithm doesn't know about this. Your credit card company does, and they're upset.`,
  };

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: f.subject,
    html: retro(`
      ${line(f.headline, "#39d353", "18px")}
      ${line(`Rule: <strong style="color:#f0c040;">${ruleName}</strong>`)}
      ${line(`<span style="font-size:64px;color:#f0c040;line-height:1;display:block;margin:16px 0;">${days}</span>`)}
      ${line("DAYS STRONG", "#c8c8b4", "16px")}
      ${line(f.body, "#888877")}
      ${cta("[VIEW YOUR STREAK →]", `${APP_URL}/app/dashboard`)}
    `),
  });
}
