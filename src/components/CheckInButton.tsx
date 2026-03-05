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
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-green-600">Held today</span>
        <button
          onClick={() => checkIn(false)}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-red-500 underline"
        >
          I slipped
        </button>
      </div>
    );
  }

  if (localState === false) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-red-500">Slipped today</span>
        <button
          onClick={() => checkIn(true)}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-green-500 underline"
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
        className="flex-1 bg-green-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition"
      >
        Held today
      </button>
      <button
        onClick={() => checkIn(false)}
        disabled={loading}
        className="flex-1 bg-red-100 text-red-600 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-red-200 disabled:opacity-60 transition"
      >
        I slipped
      </button>
    </div>
  );
}
