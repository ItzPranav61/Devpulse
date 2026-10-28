import { USERNAME_RE } from '@/lib/github';
import { clientIp, CORS, json, preflight } from '@/lib/http';
import { rateLimit } from '@/lib/ratelimit';
import { recordView } from '@/lib/store';
import { hostOf } from '@/lib/format';

export const dynamic = 'force-dynamic';

export const OPTIONS = preflight;

/** POST /api/track { username, referrer } — called by the embed page to log a widget view. */
export async function POST(req: Request) {
  if (!rateLimit(`track:${clientIp(req)}`, 120)) return json({ error: 'Too many requests' }, 429);
  try {
    const body = (await req.json()) as { username?: string; referrer?: string };
    if (!body.username || !USERNAME_RE.test(body.username)) return json({ error: 'Invalid username' }, 400);
    await recordView(body.username, hostOf(body.referrer));
    return new Response(null, { status: 204, headers: CORS });
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
}
