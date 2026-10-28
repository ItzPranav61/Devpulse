export interface Theme {
  id: string;
  name: string;
  pro: boolean;
  bg: string;
  fg: string;
  muted: string;
  border: string;
  accent: string;
  /** 5 colors: level 0 (empty) to level 4 (most active) */
  graph: [string, string, string, string, string];
}

export const DEFAULT_THEME = 'dark';

export const THEMES: Theme[] = [
  {
    id: 'dark', name: 'Dark', pro: false,
    bg: '#0d1117', fg: '#e6edf3', muted: '#8b949e', border: '#21262d', accent: '#39d353',
    graph: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  {
    id: 'light', name: 'Light', pro: false,
    bg: '#ffffff', fg: '#1f2328', muted: '#656d76', border: '#d0d7de', accent: '#1a7f37',
    graph: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  },
  {
    id: 'midnight', name: 'Midnight', pro: false,
    bg: '#0b0b12', fg: '#ececff', muted: '#8a8aa8', border: '#1e1e33', accent: '#8b7cff',
    graph: ['#15152a', '#2b2766', '#4a3fb0', '#7366f0', '#a99dff'],
  },
  {
    id: 'brutal', name: 'Brutal', pro: false,
    bg: '#f4f2ea', fg: '#0b0b0f', muted: '#4a4a55', border: '#0b0b0f', accent: '#2d3cff',
    graph: ['#e4e1d6', '#f4ffa0', '#e6ff3d', '#8fa0ff', '#2d3cff'],
  },
  {
    id: 'dracula', name: 'Dracula', pro: true,
    bg: '#282a36', fg: '#f8f8f2', muted: '#a0a4bd', border: '#3a3d4f', accent: '#bd93f9',
    graph: ['#343746', '#4b3a6b', '#7a4fb5', '#b57bee', '#ff79c6'],
  },
  {
    id: 'nord', name: 'Nord', pro: true,
    bg: '#2e3440', fg: '#eceff4', muted: '#9aa5b8', border: '#3b4252', accent: '#88c0d0',
    graph: ['#3b4252', '#41586b', '#4f7a8f', '#6ba3b8', '#88c0d0'],
  },
  {
    id: 'sunset', name: 'Sunset', pro: true,
    bg: '#1a1020', fg: '#ffeede', muted: '#c2a3a0', border: '#34202f', accent: '#ff7a59',
    graph: ['#2a1a2c', '#5a2a3a', '#9a3b3b', '#e0582f', '#ffb347'],
  },
  {
    id: 'neon', name: 'Neon', pro: true,
    bg: '#05060a', fg: '#e8fff6', muted: '#6f8f86', border: '#0f2a22', accent: '#00ffa3',
    graph: ['#0b1512', '#06402c', '#00734b', '#00c27c', '#00ffa3'],
  },
  {
    id: 'forest', name: 'Forest', pro: true,
    bg: '#0f1a14', fg: '#e4f2e7', muted: '#85a391', border: '#1c2e24', accent: '#7bd88f',
    graph: ['#16241c', '#1f4a2e', '#2e7d46', '#4fb36a', '#9be7a9'],
  },
  {
    id: 'rose', name: 'Rose', pro: true,
    bg: '#fff5f7', fg: '#3a1c26', muted: '#8f6672', border: '#f3d3dc', accent: '#e11d63',
    graph: ['#f6e3e8', '#f9b9cb', '#f27a9e', '#e0477b', '#b3124f'],
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Linear blend of two hex colors. t=0 -> a, t=1 -> b. */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const c = (x: number, y: number) =>
    Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/** Builds a full theme from up to three user-chosen colors (Pro). */
export function customTheme(base: Theme, c: { bg?: string; fg?: string; accent?: string }): Theme {
  const bg = c.bg ? `#${c.bg}` : base.bg;
  const fg = c.fg ? `#${c.fg}` : base.fg;
  const accent = c.accent ? `#${c.accent}` : base.accent;
  return {
    id: 'custom',
    name: 'Custom',
    pro: true,
    bg,
    fg,
    accent,
    muted: mix(bg, fg, 0.55),
    border: mix(bg, fg, 0.14),
    graph: [mix(bg, fg, 0.08), mix(bg, accent, 0.3), mix(bg, accent, 0.55), mix(bg, accent, 0.8), accent],
  };
}
