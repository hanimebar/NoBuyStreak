import type { Checkin } from "@/types";

/**
 * Get today's date string in a given timezone (YYYY-MM-DD).
 */
export function getTodayInTimezone(timezone: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: timezone });
}

/**
 * Given all checkins for a rule (sorted descending or any order),
 * compute current streak and longest streak.
 *
 * - current_streak: consecutive held=true days ending today or yesterday
 * - longest_streak: max run of consecutive held=true days ever
 */
export function calculateStreaks(
  checkins: Pick<Checkin, "checked_date" | "held">[],
  timezone: string
): { current_streak: number; longest_streak: number } {
  if (checkins.length === 0) return { current_streak: 0, longest_streak: 0 };

  // Sort ascending
  const sorted = [...checkins].sort((a, b) =>
    a.checked_date.localeCompare(b.checked_date)
  );

  const today = getTodayInTimezone(timezone);
  const yesterday = offsetDate(today, -1);

  // Build a map date -> held
  const byDate = new Map<string, boolean>();
  for (const c of sorted) {
    byDate.set(c.checked_date, c.held);
  }

  // Current streak: walk backwards from today (or yesterday)
  let anchor = byDate.has(today) ? today : yesterday;
  let current_streak = 0;
  let cursor = anchor;
  while (true) {
    const held = byDate.get(cursor);
    if (held === true) {
      current_streak++;
      cursor = offsetDate(cursor, -1);
    } else {
      break;
    }
  }

  // Longest streak: scan all dates in order
  let longest_streak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const c of sorted) {
    if (!c.held) {
      run = 0;
    } else {
      if (prev === null || offsetDate(prev, 1) === c.checked_date) {
        run++;
      } else {
        run = 1;
      }
      longest_streak = Math.max(longest_streak, run);
    }
    prev = c.checked_date;
  }

  return { current_streak, longest_streak };
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00Z"); // noon UTC avoids DST edge cases
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
