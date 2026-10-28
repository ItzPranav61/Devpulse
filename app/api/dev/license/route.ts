import { json } from '@/lib/http';
import { USERNAME_RE } from '@/lib/github';
import { issueKey } from '@/lib/license';
import { saveLicense } from '@/lib/store';
import type { Plan } from '@/lib/plans';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dev/license?username=octocat&plan=lifetime
 * Development only: mints a Pro key without paying so you can test Pro features locally.
 * Disabled in production.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') return json({ error: 'Not found' }, 404);
  const sp = new URL(req.url).searchParams;
  const username = sp.get('username') ?? '';
  const plan: Plan = sp.get('plan') === 'monthly' ? 'monthly' : 'lifetime';
  if (!USERNAME_RE.test(username)) return json({ error: 'Invalid username' }, 400);
  const key = issueKey(username, plan);
  await saveLicense({ key, username, plan });
  return json({ key, username: username.toLowerCase(), plan });
}
