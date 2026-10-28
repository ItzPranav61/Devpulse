import type { CSSProperties } from 'react';
import type { ActivityData } from '@/lib/types';
import type { Theme } from '@/lib/themes';
import { SECTIONS, type WidgetOptions } from '@/lib/options';
import { fmt } from '@/lib/format';

interface Props {
  data: ActivityData;
  theme: Theme;
  options: Pick<WidgetOptions, 'show' | 'repos' | 'transparent' | 'radius'>;
  badge: boolean;
  badgeHref?: string;
}

export function Widget({ data, theme: t, options: o, badge, badgeHref = '/' }: Props) {
  const has = (s: (typeof SECTIONS)[number]) => o.show.includes(s);
  const vars = {
    '--w-bg': o.transparent ? 'transparent' : t.bg,
    '--w-fg': t.fg,
    '--w-muted': t.muted,
    '--w-border': t.border,
    '--w-accent': t.accent,
    '--w-radius': `${o.radius}px`,
  } as CSSProperties;

  const rows = Array.from({ length: 7 }, (_, di) => data.weeks.map((w) => w[di]).filter(Boolean));

  return (
    <div className="dpw" style={vars}>
      {has('profile') && (
        <div className="dpw-profile">
          <img src={data.avatar} alt="" width={48} height={48} />
          <div className="dpw-grow">
            <a href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer" className="dpw-name">
              {data.name}
            </a>
            <div className="dpw-muted">@{data.username} · {fmt(data.followers)} followers · {fmt(data.totalStars)} ★</div>
          </div>
        </div>
      )}

      {has('stats') && (
        <div className="dpw-stats">
          <Stat value={data.currentStreak} label="Current streak" suffix="days" accent />
          <Stat value={data.longestStreak} label="Longest streak" suffix="days" />
          <Stat value={data.totalContributions} label="Contributions" suffix="last year" />
          <Stat value={data.pullRequests} label="Pull requests" suffix="last year" />
        </div>
      )}

      {has('graph') && (
        <div className="dpw-graph" role="img" aria-label="Contribution graph for the last year">
          {rows.map((r, di) =>
            r.map((d, wi) => (
              <span
                key={`${di}-${wi}`}
                title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}
                style={{ background: t.graph[d.level], gridRow: di + 1, gridColumn: wi + 1 }}
              />
            )),
          )}
        </div>
      )}

      {has('langs') && data.languages.length > 0 && (
        <div>
          <div className="dpw-bar">
            {data.languages.map((l) => (
              <span key={l.name} style={{ width: `${l.percent}%`, background: l.color }} title={`${l.name} ${l.percent}%`} />
            ))}
          </div>
          <div className="dpw-legend">
            {data.languages.map((l) => (
              <span key={l.name}>
                <i style={{ background: l.color }} />
                {l.name} <b>{l.percent}%</b>
              </span>
            ))}
          </div>
        </div>
      )}

      {has('repos') && data.topRepos.length > 0 && (
        <div className="dpw-repos">
          {data.topRepos.slice(0, o.repos).map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="dpw-repo">
              <div className="dpw-repo-name">{r.name}</div>
              <div className="dpw-repo-desc">{r.description ?? 'No description'}</div>
              <div className="dpw-repo-meta">
                {r.language && (
                  <span>
                    <i style={{ background: r.languageColor ?? t.muted }} />
                    {r.language}
                  </span>
                )}
                <span>★ {fmt(r.stars)}</span>
                <span>⑂ {fmt(r.forks)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {(badge || data.demo) && (
        <div className="dpw-foot">
          <span>{data.demo ? 'Demo data' : ''}</span>
          {badge && (
            <a href={badgeHref} target="_blank" rel="noopener noreferrer">
              Powered by DevPulse
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, suffix, accent }: { value: number; label: string; suffix: string; accent?: boolean }) {
  return (
    <div className="dpw-stat">
      <div className="dpw-stat-n" style={accent ? { color: 'var(--w-accent)' } : undefined}>
        {fmt(value)}
      </div>
      <div className="dpw-stat-l">{label}</div>
      <div className="dpw-muted dpw-stat-s">{suffix}</div>
    </div>
  );
}
