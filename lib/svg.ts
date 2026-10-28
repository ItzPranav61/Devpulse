import type { ActivityData } from './types';
import type { Theme } from './themes';
import { esc, fmt } from './format';

/** Static SVG version of the widget — works anywhere an <img> does (GitHub README, Notion, email). */
export function renderCardSvg(
  d: ActivityData,
  t: Theme,
  o: { radius: number; transparent: boolean; badge: boolean },
): string {
  const W = 640;
  const pad = 24;
  const cell = 14;
  const gap = 3;
  const weeks = d.weeks.slice(-30);
  const graphY = 138;
  const H = 300;

  const stats: [string, string][] = [
    [String(d.currentStreak), 'Current streak (days)'],
    [String(d.longestStreak), 'Longest streak (days)'],
    [fmt(d.totalContributions), 'Contributions, last year'],
  ];

  const statSvg = stats
    .map(([v, label], i) => {
      const x = pad + i * 196;
      return `<text x="${x}" y="94" font-size="30" font-weight="700" fill="${t.fg}">${esc(v)}</text>
<text x="${x}" y="114" font-size="12" fill="${t.muted}">${esc(label)}</text>`;
    })
    .join('\n');

  const cells = weeks
    .map((w, wi) =>
      w
        .map(
          (day, di) =>
            `<rect x="${pad + wi * (cell + gap)}" y="${graphY + di * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${t.graph[day.level]}"/>`,
        )
        .join(''),
    )
    .join('\n');

  const langs = d.languages
    .slice(0, 3)
    .map((l) => `${esc(l.name)} ${l.percent}%`)
    .join('  ·  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub activity for ${esc(d.username)}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${o.radius}" fill="${o.transparent ? 'none' : t.bg}" stroke="${t.border}"/>
<text x="${pad}" y="40" font-size="16" font-weight="600" fill="${t.fg}">@${esc(d.username)}</text>
<text x="${W - pad}" y="40" font-size="12" text-anchor="end" fill="${t.muted}">${fmt(d.totalStars)} ★  ·  ${fmt(d.followers)} followers</text>
${statSvg}
${cells}
<text x="${pad}" y="${H - 16}" font-size="11" fill="${t.muted}">${langs}</text>
${o.badge ? `<text x="${W - pad}" y="${H - 16}" font-size="11" text-anchor="end" fill="${t.accent}">Powered by DevPulse</text>` : ''}
</svg>`;
}
