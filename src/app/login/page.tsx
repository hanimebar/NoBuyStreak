"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
      else setMessage("> CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/app/dashboard";
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-muted text-xs tracking-widest mb-2">C:\NOBUY&gt; login.exe</p>
          <h1 className="font-retro text-4xl text-amber">NOBUY STREAK</h1>
          <p className="text-muted text-sm mt-1">
            {mode === "signin" ? "> WELCOME BACK" : "> START YOUR STREAK"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-retro-red text-retro-red text-sm font-mono">
            &gt; ERROR: Authentication failed.
          </div>
        )}

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2.5 text-sm hover:border-amber hover:text-amber transition mb-4"
        >
          CONTINUE WITH GOOGLE
        </button>

        <div className="relative my-4 flex items-center gap-2">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted">OR</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-card border border-border text-foreground placeholder-muted px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-amber"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-card border border-border text-foreground placeholder-muted px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-amber"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-amber text-amber font-retro text-xl px-4 py-2 hover:bg-amber hover:text-background disabled:opacity-40 transition"
          >
            {loading ? "LOADING..." : mode === "signin" ? "[SIGN IN]" : "[CREATE ACCOUNT]"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-center text-retro-green font-mono">{message}</p>
        )}

        <p className="mt-4 text-sm text-center text-muted">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button onClick={() => setMode("signup")} className="text-amber hover:underline">
                SIGN UP FREE
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button onClick={() => setMode("signin")} className="text-amber hover:underline">
                SIGN IN
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
