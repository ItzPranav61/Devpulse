'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Summary {
  total: number;
  last30Total: number;
  last30: { date: string; views: number }[];
  referrers: { host: string; views: number }[];
}

const USER_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function Dashboard() {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setUsername(localStorage.getItem('dp_user') ?? '');
      setKey(localStorage.getItem('dp_key') ?? '');
    } catch {}
  }, []);

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    const u = username.trim().replace(/^@/, '');
    if (!USER_RE.test(u)) return setError('Enter your GitHub username.');
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`/api/analytics/${encodeURIComponent(u)}`, { headers: { 'x-license-key': key.trim() } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Could not load analytics');
      setData(j);
      try {
        localStorage.setItem('dp_user', u);
        localStorage.setItem('dp_key', key.trim());
      } catch {}
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  const max = data ? Math.max(1, ...data.last30.map((d) => d.views)) : 1;

  return (
    <div className="container narrow" style={{ paddingTop: 56 }}>
      <h1 className="page-title">Analytics</h1>
      <p className="muted">See how often your widget is viewed and where it’s embedded. Requires a Pro license.</p>

      <form className="card" onSubmit={load} style={{ marginTop: 20 }}>
        <div className="field">
          <label className="lbl" htmlFor="d-user">GitHub username</label>
          <input id="d-user" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="octocat" />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="d-key">License key</label>
          <input id="d-key" className="input mono" value={key} onChange={(e) => setKey(e.target.value)} placeholder="DP-…" type="password" />
        </div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Loading…' : 'View analytics'}</button>
        {error && <div className="notice err" style={{ marginTop: 14 }}>{error} {error.includes('license') && <Link href="/pricing" className="accent">Get Pro →</Link>}</div>}
      </form>

      {data && (
        <>
          <div className="stat-cards">
            <div className="card"><div className="muted">Views, last 30 days</div><div className="big">{data.last30Total.toLocaleString()}</div></div>
            <div className="card"><div className="muted">All-time views</div><div className="big">{data.total.toLocaleString()}</div></div>
            <div className="card"><div className="muted">Top source</div><div className="big" style={{ fontSize: 22, wordBreak: 'break-all' }}>{data.referrers[0]?.host ?? '—'}</div></div>
          </div>

          <div className="card">
            <div className="muted" style={{ fontSize: 13 }}>Daily views</div>
            <div className="bars" aria-label="Daily views for the last 30 days">
              {data.last30.map((d) => (
                <div key={d.date} title={`${d.date}: ${d.views} view${d.views === 1 ? '' : 's'}`} style={{ height: `${(d.views / max) * 100}%` }} />
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Where your widget is embedded</div>
            {data.referrers.length === 0 ? (
              <p>No views yet. Embed your widget and check back.</p>
            ) : (
              <table className="tbl">
                <thead><tr><th>Source</th><th style={{ textAlign: 'right' }}>Views</th></tr></thead>
                <tbody>
                  {data.referrers.map((r) => (
                    <tr key={r.host}><td>{r.host}</td><td style={{ textAlign: 'right' }}>{r.views.toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
