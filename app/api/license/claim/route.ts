import { json } from '@/lib/http';
import { getLicenseBySession } from '@/lib/store';

export const dynamic = 'force-dynamic';

/** GET /api/license/claim?session_id=cs_... — the success page polls this until the Stripe webhook has landed. */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return json({ error: 'Invalid session' }, 400);
  const rec = await getLicenseBySession(sessionId);
  if (!rec || rec.status !== 'active') return json({ ready: false }, 404, { 'Cache-Control': 'no-store' });
  return json({ ready: true, key: rec.key, username: rec.username, plan: rec.plan }, 200, { 'Cache-Control': 'no-store' });
}
