import { json } from '@/lib/http';
import { verifyLicense } from '@/lib/license';

export const dynamic = 'force-dynamic';

/** POST /api/license/verify { key, username? } */
export async function POST(req: Request) {
  try {
    const { key, username } = (await req.json()) as { key?: string; username?: string };
    const res = await verifyLicense(key, username);
    return json(res, 200, { 'Cache-Control': 'no-store' });
  } catch {
    return json({ valid: false }, 400);
  }
}
