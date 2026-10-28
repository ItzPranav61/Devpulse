import { customTheme, DEFAULT_THEME, getTheme, type Theme } from './themes';

export const SECTIONS = ['profile', 'stats', 'graph', 'langs', 'repos'] as const;
export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  profile: 'Profile header',
  stats: 'Streak & stats',
  graph: 'Contribution graph',
  langs: 'Languages',
  repos: 'Top repositories',
};

export interface WidgetOptions {
  theme: string;
  show: Section[];
  repos: number; // 1-6
  transparent: boolean;
  radius: number; // 0-28
  custom: { bg?: string; fg?: string; accent?: string }; // 6-digit hex without '#'
}

export const DEFAULT_OPTIONS: WidgetOptions = {
  theme: DEFAULT_THEME,
  show: [...SECTIONS],
  repos: 4,
  transparent: false,
  radius: 16,
  custom: {},
};

type Input = URLSearchParams | Record<string, string | string[] | undefined>;

function get(i: Input, k: string): string | undefined {
  if (i instanceof URLSearchParams) return i.get(k) ?? undefined;
  const v = i[k];
  return Array.isArray(v) ? v[0] : v;
}

const HEX = /^[0-9a-f]{6}$/i;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function parseOptions(i: Input): WidgetOptions {
  const theme = get(i, 'theme') ?? DEFAULT_OPTIONS.theme;

  const showRaw = get(i, 'show');
  let show: Section[] = DEFAULT_OPTIONS.show;
  if (showRaw !== undefined) {
    const picked = showRaw.split(',').filter((s): s is Section => (SECTIONS as readonly string[]).includes(s));
    show = SECTIONS.filter((s) => picked.includes(s)); // keep canonical order
  }

  const repos = Number(get(i, 'repos'));
  const radius = Number(get(i, 'radius'));

  const custom: WidgetOptions['custom'] = {};
  for (const [param, key] of [['c_bg', 'bg'], ['c_fg', 'fg'], ['c_accent', 'accent']] as const) {
    const v = get(i, param);
    if (v && HEX.test(v)) custom[key] = v.toLowerCase();
  }

  return {
    theme,
    show,
    repos: Number.isFinite(repos) && repos > 0 ? clamp(Math.round(repos), 1, 6) : DEFAULT_OPTIONS.repos,
    transparent: get(i, 'transparent') === '1',
    radius: get(i, 'radius') !== undefined && Number.isFinite(radius) ? clamp(Math.round(radius), 0, 28) : DEFAULT_OPTIONS.radius,
    custom,
  };
}

/** Serialises options to a query string, omitting defaults to keep URLs short. */
export function toQuery(o: WidgetOptions): string {
  const p = new URLSearchParams();
  if (o.theme !== DEFAULT_OPTIONS.theme) p.set('theme', o.theme);
  if (o.show.join(',') !== DEFAULT_OPTIONS.show.join(',')) p.set('show', o.show.join(','));
  if (o.repos !== DEFAULT_OPTIONS.repos) p.set('repos', String(o.repos));
  if (o.transparent) p.set('transparent', '1');
  if (o.radius !== DEFAULT_OPTIONS.radius) p.set('radius', String(o.radius));
  if (o.custom.bg) p.set('c_bg', o.custom.bg);
  if (o.custom.fg) p.set('c_fg', o.custom.fg);
  if (o.custom.accent) p.set('c_accent', o.custom.accent);
  return p.toString();
}

/** Applies Pro gating: Pro themes and custom colors fall back to the default for free users. */
export function resolveTheme(o: WidgetOptions, pro: boolean): Theme {
  let t = getTheme(o.theme);
  if (t.pro && !pro) t = getTheme(DEFAULT_THEME);
  if (pro && (o.custom.bg || o.custom.fg || o.custom.accent)) t = customTheme(t, o.custom);
  return t;
}
