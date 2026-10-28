import type { ActivityData, Day, Level } from './types';
import { computeStreaks } from './streak';

/** Small seeded PRNG so a given username always produces the same demo data. */
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REPO_NAMES = [
  ['pulse-engine', 'Real-time event pipeline with typed schemas', 'TypeScript', '#3178c6'],
  ['nano-router', 'A 2kb client-side router with zero dependencies', 'JavaScript', '#f1e05a'],
  ['ledger-core', 'Double-entry accounting primitives for Go services', 'Go', '#00ADD8'],
  ['rustic-cache', 'Lock-free LRU cache with async eviction', 'Rust', '#dea584'],
  ['dotfiles', 'My terminal, editor and tooling setup', 'Shell', '#89e051'],
  ['vision-lab', 'Experiments with small on-device vision models', 'Python', '#3572A5'],
] as const;

export function demoActivity(username: string): ActivityData {
  const rand = mulberry32(hash(username.toLowerCase()));
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Start on the Sunday 52 weeks before this week's Sunday.
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay() - 52 * 7);

  const days: Day[] = [];
  const intensity = 0.55 + rand() * 0.35; // how often this dev commits
  let streakMode = false;
  for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    // "Hot" periods make realistic runs of consecutive days.
    if (rand() < 0.04) streakMode = !streakMode;
    const p = (streakMode ? 0.95 : intensity) * (weekend ? 0.55 : 1);
    let count = rand() < p ? Math.ceil(rand() * rand() * 14) : 0;
    if (d.getTime() === today.getTime() && rand() < 0.3) count = 0;
    const level: Level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
    days.push({ date: d.toISOString().slice(0, 10), count, level });
  }

  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const total = days.reduce((s, d) => s + d.count, 0);
  const { current, longest } = computeStreaks(days);

  const topRepos = REPO_NAMES.map(([name, description, language, color], i) => ({
    name,
    description,
    url: `https://github.com/${username}/${name}`,
    stars: Math.round((rand() * 900 + 40) / (i + 1)) + 3,
    forks: Math.round(rand() * 120 / (i + 1)),
    language,
    languageColor: color,
  })).sort((a, b) => b.stars - a.stars);

  const weights = REPO_NAMES.slice(0, 5).map(() => rand() + 0.15);
  const sum = weights.reduce((a, b) => a + b, 0);
  const languages = REPO_NAMES.slice(0, 5)
    .map(([, , name, color], i) => ({ name, color, percent: Math.round((weights[i] / sum) * 1000) / 10 }))
    .sort((a, b) => b.percent - a.percent);

  return {
    username,
    name: username,
    avatar: `https://github.com/${encodeURIComponent(username)}.png?size=120`,
    bio: 'Demo data — add a GITHUB_TOKEN to show real activity.',
    followers: Math.round(rand() * 2400),
    following: Math.round(rand() * 120),
    publicRepos: 12 + Math.round(rand() * 60),
    totalStars: topRepos.reduce((s, r) => s + r.stars, 0),
    totalContributions: total,
    commits: Math.round(total * 0.78),
    pullRequests: Math.round(total * 0.14),
    issues: Math.round(total * 0.08),
    currentStreak: current,
    longestStreak: longest,
    weeks,
    topRepos,
    languages,
    demo: true,
    fetchedAt: new Date().toISOString(),
  };
}
