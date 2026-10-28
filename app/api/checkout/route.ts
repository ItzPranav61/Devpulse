import { appUrl, json } from '@/lib/http';
import { USERNAME_RE } from '@/lib/github';
import { PLANS, type Plan } from '@/lib/plans';

export const dynamic = 'force-dynamic';

const enc = encodeURIComponent;

/** POST /api/checkout { plan, username } → { url } to redirect the browser to Stripe Checkout. */
export async function POST(req: Request) {
  let body: { plan?: string; username?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  const plan = body.plan as Plan;
  const username = body.username ?? '';
  if (!(plan in PLANS)) return json({ error: 'Unknown plan' }, 400);
  if (!USERNAME_RE.test(username)) return json({ error: 'Enter a valid GitHub username first' }, 400);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[PLANS[plan].priceEnv];

  if (!secretKey || !priceId) {
    // No Stripe configured: allow a free demo checkout in development only.
    if (process.env.NODE_ENV !== 'production') {
      return json({ url: `/success?demo=1&username=${enc(username)}&plan=${plan}`, demo: true });
    }
    return json({ error: 'Payments are not configured yet' }, 503);
  }

  const base = appUrl();
  const fields: [string, string][] = [
    ['mode', plan === 'monthly' ? 'subscription' : 'payment'],
    ['line_items[0][price]', priceId],
    ['line_items[0][quantity]', '1'],
    ['cancel_url', `${base}/builder?u=${username}`],
    ['client_reference_id', username],
    ['metadata[username]', username],
    ['metadata[plan]', plan],
  ];
  if (plan === 'monthly') fields.push(['subscription_data[metadata][username]', username]);

  // The {CHECKOUT_SESSION_ID} placeholder must stay literal, so build the form body by hand.
  const form =
    fields.map(([k, v]) => `${enc(k)}=${enc(v)}`).join('&') +
    `&success_url=${enc(`${base}/success?session_id=`)}{CHECKOUT_SESSION_ID}`;

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const session = await res.json();
  if (!res.ok || !session.url) {
    console.error('Stripe checkout error', session?.error?.message);
    return json({ error: 'Could not start checkout' }, 502);
  }
  return json({ url: session.url });
}
