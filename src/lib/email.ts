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
    subject: "Welcome to NoBuy Streak — your streak starts now",
    html: retro(`
      ${line("&gt; WELCOME. YOUR STREAK HAS STARTED.", "#f0c040", "18px")}
      ${line("You've set up your first No Buy rule:")}
      ${line(`&gt; <strong style="color:#f0c040;">${ruleName}</strong>`)}
      ${line("Check in daily — one tap to mark each day held. The longer your streak, the stronger the habit.")}
      ${line("Tip: log temptations too. Seeing what almost tripped you up 30 days later is surprisingly powerful.", "#888877")}
      ${cta("[GO TO DASHBOARD]", `${APP_URL}/app/dashboard`)}
    `),
  });
}

// ── Pro upgrade email ─────────────────────────────────────────────────────────

export async function sendProUpgradeEmail(email: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "You're now Pro — NoBuy Streak",
    html: retro(`
      ${line("&gt; PRO ACTIVATED.", "#39d353", "18px")}
      ${line("Your account has been upgraded to NoBuy Streak Pro:")}
      ${line("&gt; Unlimited rules", "#c8c8b4")}
      ${line("&gt; Shareable PNG streak cards", "#c8c8b4")}
      ${line("&gt; 30-day lookback emails", "#c8c8b4")}
      ${line("Manage your billing anytime from your account settings.", "#888877")}
      ${cta("[GO TO DASHBOARD]", `${APP_URL}/app/dashboard`)}
    `),
  });
}

// ── Subscription cancelled email ─────────────────────────────────────────────

export async function sendCancellationEmail(email: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your NoBuy Streak Pro subscription has ended",
    html: retro(`
      ${line("&gt; SUBSCRIPTION ENDED.", "#f0c040", "18px")}
      ${line("Your Pro plan has been cancelled. Your account is now on the Free plan:")}
      ${line("&gt; 1 active rule (oldest kept active)", "#888877")}
      ${line("&gt; Streak history preserved", "#888877")}
      ${line("&gt; Card downloads disabled", "#888877")}
      ${line("Your streak data is safe — nothing has been deleted. Resubscribe anytime.", "#888877")}
      ${cta("[RESUBSCRIBE]", `${APP_URL}/pricing`)}
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
  const messages: Record<number, string> = {
    7:   "One full week. Most people quit by day 3. You didn't.",
    30:  "30 days. That's a habit now — not just a decision.",
    100: "100 days strong. This is who you are now.",
    365: "One full year. Legendary.",
  };
  const msg = messages[days] ?? `${days} days and counting.`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${days}-day streak — ${ruleName} 🔥`,
    html: retro(`
      ${line(`&gt; ${days}-DAY STREAK UNLOCKED.`, "#39d353", "18px")}
      ${line(`Rule: <strong style="color:#f0c040;">${ruleName}</strong>`)}
      ${line(`<span style="font-size:56px;color:#f0c040;line-height:1;">${days}</span>`)}
      ${line("DAYS STRONG", "#c8c8b4", "16px")}
      ${line(msg, "#888877")}
      ${cta("[VIEW YOUR STREAK]", `${APP_URL}/app/dashboard`)}
    `),
  });
}
