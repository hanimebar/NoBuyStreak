"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  ruleId: string;
  checkedToday: boolean | null;
}

export default function CheckInButton({ ruleId, checkedToday }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localState, setLocalState] = useState<boolean | null>(checkedToday);

  async function checkIn(held: boolean) {
    setLoading(true);
    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule_id: ruleId, held }),
    });
    if (res.ok) {
      setLocalState(held);
      router.refresh();
    }
    setLoading(false);
  }

  if (localState === true) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-retro text-lg text-retro-green">[HELD]</span>
        <button
          onClick={() => checkIn(false)}
          disabled={loading}
          className="text-xs text-muted hover:text-retro-red underline"
        >
          I slipped
        </button>
      </div>
    );
  }

  if (localState === false) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-retro text-lg text-retro-red">[SLIPPED]</span>
        <button
          onClick={() => checkIn(true)}
          disabled={loading}
          className="text-xs text-muted hover:text-retro-green underline"
        >
          Actually held
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => checkIn(true)}
        disabled={loading}
        className="flex-1 border border-retro-green text-retro-green font-retro text-lg px-3 py-1 hover:bg-retro-green hover:text-background disabled:opacity-40 transition"
      >
        [HELD TODAY]
      </button>
      <button
        onClick={() => checkIn(false)}
        disabled={loading}
        className="flex-1 border border-retro-red text-retro-red font-retro text-lg px-3 py-1 hover:bg-retro-red hover:text-background disabled:opacity-40 transition"
      >
        [I SLIPPED]
      </button>
    </div>
  );
}
