"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  ruleId: string;
  checkedToday: boolean | null;
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 border font-retro text-lg whitespace-nowrap transition-all
        ${ok ? "border-retro-green text-retro-green bg-background" : "border-retro-red text-retro-red bg-background"}`}
    >
      {msg}
    </div>
  );
}

export default function CheckInButton({ ruleId, checkedToday }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localState, setLocalState] = useState<boolean | null>(checkedToday);
  const [streak, setStreak] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function checkIn(held: boolean) {
    setLoading(true);
    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule_id: ruleId, held }),
    });
    if (res.ok) {
      const data = await res.json();
      setLocalState(held);
      setStreak(data.current_streak);
      if (held) {
        setToast({ msg: `DAY ${data.current_streak} — HELD. STREAK LIVES.`, ok: true });
      } else {
        setToast({ msg: "SLIPPED. RESET TO ZERO. TRY AGAIN TOMORROW.", ok: false });
      }
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {localState === true ? (
        <div className="flex items-center gap-3">
          <span className="font-retro text-lg text-retro-green">
            {streak !== null ? `[DAY ${streak} — HELD ✓]` : "[HELD ✓]"}
          </span>
          <button
            onClick={() => checkIn(false)}
            disabled={loading}
            className="text-xs text-muted hover:text-retro-red underline"
          >
            I actually slipped
          </button>
        </div>
      ) : localState === false ? (
        <div className="flex items-center gap-3">
          <span className="font-retro text-lg text-retro-red">[SLIPPED]</span>
          <button
            onClick={() => checkIn(true)}
            disabled={loading}
            className="text-xs text-muted hover:text-retro-green underline"
          >
            Wait, I held
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => checkIn(true)}
            disabled={loading}
            className="flex-1 border border-retro-green text-retro-green font-retro text-lg px-3 py-1.5 hover:bg-retro-green hover:text-background disabled:opacity-40 transition"
          >
            [HELD TODAY]
          </button>
          <button
            onClick={() => checkIn(false)}
            disabled={loading}
            className="flex-1 border border-retro-red text-retro-red font-retro text-lg px-3 py-1.5 hover:bg-retro-red hover:text-background disabled:opacity-40 transition"
          >
            [I SLIPPED]
          </button>
        </div>
      )}
    </>
  );
}
