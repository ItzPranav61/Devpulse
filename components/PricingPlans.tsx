'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FREE_FEATURES, PLANS, PRO_FEATURES, type Plan } from '@/lib/plans';

export function PricingPlans({ initialUsername = '' }: { initialUsername?: string }) {
  const [username, setUsername] = useState(initialUsername);
  const [busy, setBusy] = useState<Plan | null>(null);
  const [error, setError] = useState('');

  async function buy(plan: Plan) {
    setError('');
    setBusy(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, username: username.trim().replace(/^@/, '') }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="card" style={{ maxWidth: 520, margin: '0 auto 28px' }}>
        <label className="lbl" htmlFor="pp-user">GitHub username to upgrade</label>
        <input
          id="pp-user"
          className="input"
          placeholder="octocat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          spellCheck={false}
        />
        <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          Pro is attached to this username — your widget upgrades instantly after payment.
        </div>
        {error && <div className="notice err" style={{ marginTop: 12 }}>{error}</div>}
      </div>

      <div className="plans">
        <div className="card plan">
          <h3>Free</h3>
          <div className="price">$0</div>
          <div className="muted">Forever</div>
          <ul>{FREE_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          <Link href="/builder" className="btn">Start free</Link>
        </div>

        <div className="card plan featured">
          <span className="ribbon">MOST POPULAR</span>
          <h3>{PLANS.monthly.name}</h3>
          <div className="price">${PLANS.monthly.price}<small> {PLANS.monthly.cadence}</small></div>
          <div className="muted">{PLANS.monthly.blurb}</div>
          <ul>{PRO_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          <button className="btn btn-primary" disabled={busy !== null} onClick={() => buy('monthly')}>
            {busy === 'monthly' ? 'Redirecting…' : 'Go Pro — $3/mo'}
          </button>
        </div>

        <div className="card plan">
          <h3>{PLANS.lifetime.name}</h3>
          <div className="price">${PLANS.lifetime.price}<small> {PLANS.lifetime.cadence}</small></div>
          <div className="muted">{PLANS.lifetime.blurb}</div>
          <ul>{PRO_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          <button className="btn" disabled={busy !== null} onClick={() => buy('lifetime')}>
            {busy === 'lifetime' ? 'Redirecting…' : 'Get lifetime — $5'}
          </button>
        </div>
      </div>
    </div>
  );
}
