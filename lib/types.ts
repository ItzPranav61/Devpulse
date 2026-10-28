export type Level = 0 | 1 | 2 | 3 | 4;

export interface Day {
  date: string; // YYYY-MM-DD
  count: number;
  level: Level;
}

export interface RepoInfo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
}

export interface LangInfo {
  name: string;
  color: string;
  percent: number;
}

export interface ActivityData {
  username: string;
  name: string;
  avatar: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  currentStreak: number;
  longestStreak: number;
  weeks: Day[][];
  topRepos: RepoInfo[];
  languages: LangInfo[];
  demo: boolean;
  fetchedAt: string;
}
