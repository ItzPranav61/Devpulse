import type { Day } from './types';

/**
 * Computes current and longest contribution streaks from a flat, chronologically
 * ordered list of days. The current streak is still alive if today has no
 * contributions yet but yesterday did.
 */
export function computeStreaks(days: Day[]): { current: number; longest: number } {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i -= 1;
  for (; i >= 0 && days[i].count > 0; i -= 1) current += 1;

  return { current, longest };
}
