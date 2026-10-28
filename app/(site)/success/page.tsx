'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CopyButton } from '@/components/CopyButton';

interface Claim { key: string; username: string; plan: string }

function Inner() {
  const sp = useSearchParams();
  const sessionId = sp.get('session_id');
  const demo = sp.get('demo') === '1';
  const [claim, setClaim] = useState<Claim | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let stop = false;
    let tries = 0;

    async function run() {
      try {
        if (demo) {
          const r = await fetch(`/api/dev/license?username=${encodeURIComponent(sp.get('username') ?? '')}&plan=${sp.get('plan') ?? 'lifetime'}`);
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || 'Could not create demo license');
          if (!stop) setClaim(j);
          return;
        }
        if (!sessionId) throw new Error('Missing checkout session');
        // The Stripe webhook may land a moment after the redirect, so poll briefly.
        while (!stop && tries < 20) {
          const r = await fetch(`/api/license/claim?session_id=${encodeURIComponent(sessionId)}`);
          if (r.ok) {
            setClaim(await r.json());
            return;
          }
          tries += 1;
          await new Promise((res) => setTimeout(res, 1500));
        }
        if (!stop) setError('Your payment went through, but the license is still being issued. Refresh in a minute, or contact support with your Stripe receipt.');
      } catch (e) {
        if (!stop) setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    }
    run();
    return () => { stop = true; };
  }, [demo, sessionId, sp]);

  return (
    <div className="container narrow" style={{ paddingTop: 80 }}>
      <div className="card center">
        {!claim && !error && <><h2 style={{ marginTop: 0 }}>Finishing up…</h2><p className="muted">Issuing your Pro license.</p></>}
        {error && <div className="notice err">{error}</div>}
        {claim && (
          <>
            <div className="icon" style={{ margin: '0 auto' }}>🎉</div>
            <h2 style={{ margin: '14px 0 6px' }}>You’re Pro, @{claim.username}!</h2>
            <p className="muted">Your widget now has every theme, no badge and analytics. Save this key — it unlocks your analytics dashboard.</p>
            <div className="code" style={{ whiteSpace: 'normal', wordBreak: 'break-all', textAlign: 'left', margin: '18px 0 10px' }}>{claim.key}</div>
            <CopyButton text={claim.key} label="Copy license key" />
            <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href={`/builder?u=${encodeURIComponent(claim.username)}`}>Open builder</Link>
              <Link className="btn" href="/dashboard">Analytics dashboard</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
