import crypto from 'crypto';
import type { Plan } from './plans';
import { getLicenseByKey } from './store';

/**
 * License keys look like `DP-<base64url payload>.<hmac signature>`.
 * The key is the dashboard credential (analytics access). Whether a *widget* renders
 * with Pro features is decided server-side by username (see store.hasActiveLicense),
 * so keys never need to appear in public embed URLs.
 */

function secret(): string {
  const s = process.env.LICENSE_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === 'production') throw new Error('LICENSE_SECRET must be set in production');
  return 'dev-only-secret-change-me';
}

const sign = (data: string) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

export function issueKey(username: string, plan: Plan): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username.toLowerCase(), p: plan, i: Date.now(), n: crypto.randomBytes(4).toString('hex') }),
  ).toString('base64url');
  return `DP-${payload}.${sign(payload)}`;
}

export interface LicenseCheck {
  valid: boolean;
  plan?: Plan;
  username?: string;
}

export async function verifyLicense(key: string | null | undefined, username?: string): Promise<LicenseCheck> {
  try {
    if (!key || !key.startsWith('DP-')) return { valid: false };
    const [payload, sig] = key.slice(3).split('.');
    if (!payload || !sig) return { valid: false };

    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { valid: false };

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { u: string; p: Plan };
    if (username && data.u !== username.toLowerCase()) return { valid: false };

    const rec = await getLicenseByKey(key);
    if (!rec || rec.status !== 'active') return { valid: false }; // unknown or revoked

    return { valid: true, plan: data.p, username: data.u };
  } catch {
    return { valid: false };
  }
}
