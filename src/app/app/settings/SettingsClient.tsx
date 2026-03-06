"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { CURRENCIES } from "@/lib/currencies";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Belgium","Bolivia",
  "Brazil","Canada","Chile","China","Colombia","Croatia","Czech Republic","Denmark",
  "Ecuador","Egypt","Estonia","Finland","France","Germany","Ghana","Greece","Hungary",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Latvia","Lithuania","Malaysia","Mexico","Morocco","Netherlands","New Zealand",
  "Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania",
  "Russia","Saudi Arabia","Serbia","Singapore","Slovakia","Slovenia","South Africa",
  "South Korea","Spain","Sweden","Switzerland","Thailand","Tunisia","Turkey","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Vietnam",
].sort();

interface Profile {
  email: string;
  is_pro: boolean;
  stripe_subscription_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
  birth_year: number | null;
  lookback_emails: boolean;
  currency: string;
}

interface Props {
  profile: Profile | null;
  provider: string;
  userId: string;
}

function Section({ title, cmd, children }: { title: string; cmd: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-muted">&gt;</span>
        <h2 className="font-retro text-xl text-amber">{title}</h2>
        <span className="font-mono text-xs text-muted ml-1">{cmd}</span>
      </div>
      <div className="border border-border bg-card p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-background border border-border text-foreground placeholder-muted px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber ${props.className ?? ""}`}
    />
  );
}

function StatusMsg({ msg, ok }: { msg: string; ok: boolean }) {
  if (!msg) return null;
  return (
    <p className={`font-mono text-xs mt-2 ${ok ? "text-retro-green" : "text-retro-red"}`}>
      &gt; {msg}
    </p>
  );
}

function Avatar({ url, name, size = 64 }: { url: string | null; name: string | null; size?: number }) {
  const initials = (name ?? "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  if (url) {
    return (
      <img
        src={url}
        alt="avatar"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="border-2 border-amber object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className="border-2 border-border bg-background flex items-center justify-center font-retro text-amber"
    >
      {initials}
    </div>
  );
}

export default function SettingsClient({ profile, provider, userId }: Props) {
  const supabase = createClient();

  // Profile form state
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [birthYear, setBirthYear] = useState(profile?.birth_year?.toString() ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [profileMsg, setProfileMsg] = useState({ text: "", ok: false });
  const [profileLoading, setProfileLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ text: "", ok: false });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preferences
  const [lookbackEmails, setLookbackEmails] = useState(profile?.lookback_emails ?? true);
  const [currency, setCurrency] = useState(profile?.currency ?? "EUR");
  const [prefMsg, setPrefMsg] = useState({ text: "", ok: false });

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState({ text: "", ok: false });
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ text: "Max file size is 2MB", ok: false });
      return;
    }
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error, data } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (error) { setProfileMsg({ text: error.message, ok: false }); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(publicUrl + "?t=" + Date.now());
    await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar_url: publicUrl }),
    });
    setProfileMsg({ text: "Avatar updated", ok: true });
  }

  // ── Profile save ──────────────────────────────────────────────────────────
  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ text: "", ok: false });
    const yearNum = birthYear ? parseInt(birthYear) : null;
    if (yearNum && (yearNum < 1900 || yearNum > new Date().getFullYear() - 13)) {
      setProfileMsg({ text: "Enter a valid birth year", ok: false });
      setProfileLoading(false);
      return;
    }
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName, country, birth_year: yearNum }),
    });
    setProfileMsg(res.ok ? { text: "Profile saved", ok: true } : { text: "Save failed", ok: false });
    setProfileLoading(false);
  }

  // ── Password change ────────────────────────────────────────────────────────
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match", ok: false }); return;
    }
    setPasswordLoading(true);
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await res.json();
    setPasswordMsg(res.ok ? { text: "Password updated", ok: true } : { text: data.error, ok: false });
    if (res.ok) { setNewPassword(""); setConfirmPassword(""); }
    setPasswordLoading(false);
  }

  // ── Preferences save ──────────────────────────────────────────────────────
  async function handlePrefSave() {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lookback_emails: lookbackEmails, currency }),
    });
    setPrefMsg(res.ok ? { text: "Preferences saved", ok: true } : { text: "Save failed", ok: false });
  }

  // ── Pause all rules ───────────────────────────────────────────────────────
  async function handlePauseAll() {
    setPauseLoading(true);
    const res = await fetch("/api/account/pause-rules", { method: "POST" });
    setPauseLoading(false);
    if (res.ok) window.location.reload();
  }

  // ── Billing portal ────────────────────────────────────────────────────────
  async function handleBillingPortal() {
    const res = await fetch("/api/billing-portal", { method: "POST" });
    if (res.ok) { const { url } = await res.json(); window.location.href = url; }
  }

  // ── Restore Pro (self-heal if webhook missed) ─────────────────────────────
  const [restoreMsg, setRestoreMsg] = useState({ text: "", ok: false });
  const [restoreLoading, setRestoreLoading] = useState(false);
  async function handleRestorePro() {
    setRestoreLoading(true);
    setRestoreMsg({ text: "", ok: false });
    const res = await fetch("/api/account/restore-pro", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setRestoreMsg({ text: "Pro restored! Reloading...", ok: true });
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setRestoreMsg({ text: data.error ?? "Could not restore Pro.", ok: false });
    }
    setRestoreLoading(false);
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // ── Delete account ────────────────────────────────────────────────────────
  async function handleDelete() {
    if (deleteConfirm !== "DELETE") {
      setDeleteMsg({ text: 'Type "DELETE" to confirm', ok: false }); return;
    }
    setDeleteLoading(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (res.ok) {
      await supabase.auth.signOut();
      window.location.href = "/?deleted=1";
    } else {
      const d = await res.json();
      setDeleteMsg({ text: d.error ?? "Deletion failed", ok: false });
      setDeleteLoading(false);
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-2">

      {/* ── PROFILE ─────────────────────────────────────────────────────── */}
      <Section title="PROFILE" cmd="[optional]">
        <form onSubmit={handleProfileSave} className="space-y-4">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar url={avatarUrl || null} name={displayName || profile?.email || null} size={72} />
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="border border-border text-foreground font-mono text-xs px-3 py-1.5 hover:border-amber hover:text-amber transition"
              >
                UPLOAD PHOTO
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={async () => {
                    setAvatarUrl("");
                    await fetch("/api/account/profile", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ avatar_url: "" }),
                    });
                  }}
                  className="block mt-1 font-mono text-xs text-muted hover:text-retro-red underline"
                >
                  remove
                </button>
              )}
              <p className="font-mono text-xs text-muted mt-1">JPG, PNG · max 2MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          <Field label="Display name">
            <Input
              type="text"
              placeholder="How you appear on the leaderboard"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={40}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Country">
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
              >
                <option value="">— not set —</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Birth year">
              <Input
                type="number"
                placeholder={String(currentYear - 25)}
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
                min="1900"
                max={currentYear - 13}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="border border-amber text-amber font-retro text-lg px-4 py-1.5 hover:bg-amber hover:text-background disabled:opacity-40 transition"
          >
            {profileLoading ? "SAVING..." : "[SAVE PROFILE]"}
          </button>
          <StatusMsg msg={profileMsg.text} ok={profileMsg.ok} />
        </form>
      </Section>

      {/* ── ACCOUNT ─────────────────────────────────────────────────────── */}
      <Section title="ACCOUNT" cmd="[auth]">
        <Field label="Email">
          <p className="font-mono text-sm text-foreground py-2">{profile?.email}</p>
        </Field>

        <Field label="Auth provider">
          <p className="font-mono text-sm text-muted capitalize py-1">{provider}</p>
        </Field>

        {provider === "email" && (
          <form onSubmit={handlePasswordChange} className="space-y-3 border-t border-border pt-4">
            <p className="font-mono text-xs text-muted">CHANGE PASSWORD</p>
            <Input
              type="password"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={passwordLoading}
              className="border border-border text-foreground font-mono text-xs px-4 py-1.5 hover:border-amber hover:text-amber disabled:opacity-40 transition"
            >
              {passwordLoading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
            <StatusMsg msg={passwordMsg.text} ok={passwordMsg.ok} />
          </form>
        )}

        <div className="border-t border-border pt-4">
          <button
            onClick={handleSignOut}
            className="border border-border text-muted font-mono text-xs px-4 py-1.5 hover:border-retro-red hover:text-retro-red transition"
          >
            SIGN OUT
          </button>
        </div>
      </Section>

      {/* ── SUBSCRIPTION ────────────────────────────────────────────────── */}
      <Section title="SUBSCRIPTION" cmd="[billing]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-muted mb-0.5">CURRENT PLAN</p>
            <p className={`font-retro text-2xl ${profile?.is_pro ? "text-amber" : "text-foreground"}`}>
              {profile?.is_pro ? "PRO" : "FREE"}
            </p>
          </div>
          {profile?.is_pro ? (
            <button
              onClick={handleBillingPortal}
              className="border border-border text-foreground font-mono text-xs px-4 py-1.5 hover:border-amber hover:text-amber transition"
            >
              MANAGE / CANCEL
            </button>
          ) : (
            <a
              href="/pricing"
              className="border border-amber text-amber font-retro text-lg px-4 py-1.5 hover:bg-amber hover:text-background transition"
            >
              [UPGRADE]
            </a>
          )}
        </div>

        {profile?.is_pro && (
          <p className="font-mono text-xs text-muted">
            To cancel, pause, or change your plan — use the billing portal above.
            Cancellations take effect at the end of the billing period.
          </p>
        )}

        {!profile?.is_pro && (
          <div className="border-t border-border pt-4">
            <p className="font-mono text-xs text-muted mb-2">
              Already paid? If Pro didn&apos;t activate, use this to restore it:
            </p>
            <button
              onClick={handleRestorePro}
              disabled={restoreLoading}
              className="font-mono text-xs border border-border text-muted px-4 py-1.5 hover:border-retro-green hover:text-retro-green disabled:opacity-40 transition"
            >
              {restoreLoading ? "CHECKING..." : "RESTORE PRO"}
            </button>
            <StatusMsg msg={restoreMsg.text} ok={restoreMsg.ok} />
          </div>
        )}
      </Section>

      {/* ── PREFERENCES ─────────────────────────────────────────────────── */}
      <Section title="PREFERENCES" cmd="[emails + currency]">
        <Field label="Currency">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-foreground">30-day lookback emails</p>
            <p className="font-mono text-xs text-muted mt-0.5">
              Weekly reminder of temptations you logged ~30 days ago
            </p>
          </div>
          <button
            onClick={() => setLookbackEmails(v => !v)}
            className={`w-12 h-6 border transition relative ${lookbackEmails ? "border-retro-green bg-retro-green" : "border-border bg-background"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 transition-all ${lookbackEmails ? "left-6 bg-background" : "left-0.5 bg-muted"}`}
            />
          </button>
        </div>
        <button
          onClick={handlePrefSave}
          className="border border-border text-foreground font-mono text-xs px-4 py-1.5 hover:border-amber hover:text-amber transition"
        >
          SAVE PREFERENCES
        </button>
        <StatusMsg msg={prefMsg.text} ok={prefMsg.ok} />
      </Section>

      {/* ── DANGER ZONE ─────────────────────────────────────────────────── */}
      <Section title="DANGER ZONE" cmd="[irreversible]">

        {/* Pause all rules */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-foreground">Pause all rules</p>
            <p className="font-mono text-xs text-muted mt-0.5">
              Hides all rules from your dashboard. Streaks are preserved.
            </p>
          </div>
          <button
            onClick={handlePauseAll}
            disabled={pauseLoading}
            className="shrink-0 border border-border text-muted font-mono text-xs px-3 py-1.5 hover:border-amber hover:text-amber disabled:opacity-40 transition"
          >
            {pauseLoading ? "..." : "PAUSE ALL"}
          </button>
        </div>

        <div className="border-t border-border pt-4">
          {!showDeletePanel ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-foreground">Delete account</p>
                <p className="font-mono text-xs text-muted mt-0.5">
                  Permanently deletes all your data. Cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeletePanel(true)}
                className="shrink-0 border border-retro-red text-retro-red font-mono text-xs px-3 py-1.5 hover:bg-retro-red hover:text-background transition"
              >
                DELETE
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-mono text-xs text-retro-red">
                &gt; This will delete your account, all rules, check-ins, and temptation logs.
                Your Stripe subscription will be cancelled immediately.
              </p>
              <p className="font-mono text-xs text-muted">
                Type <span className="text-foreground">DELETE</span> to confirm:
              </p>
              <Input
                type="text"
                placeholder="DELETE"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="border-retro-red focus:border-retro-red"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading || deleteConfirm !== "DELETE"}
                  className="border border-retro-red text-retro-red font-retro text-lg px-4 py-1.5 hover:bg-retro-red hover:text-background disabled:opacity-30 transition"
                >
                  {deleteLoading ? "DELETING..." : "[CONFIRM DELETE]"}
                </button>
                <button
                  onClick={() => { setShowDeletePanel(false); setDeleteConfirm(""); }}
                  className="border border-border text-muted font-mono text-xs px-4 py-1.5 hover:border-amber hover:text-amber transition"
                >
                  CANCEL
                </button>
              </div>
              <StatusMsg msg={deleteMsg.text} ok={deleteMsg.ok} />
            </div>
          )}
        </div>
      </Section>

    </div>
  );
}
