export type Plan = 'monthly' | 'lifetime';

export interface PlanInfo {
  id: Plan;
  name: string;
  price: number; // USD
  cadence: string;
  blurb: string;
  priceEnv: string;
}

// Prices live here so you can change them in one place (and in Stripe).
export const PLANS: Record<Plan, PlanInfo> = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 3,
    cadence: '/month',
    blurb: 'Cancel anytime.',
    priceEnv: 'STRIPE_PRICE_MONTHLY',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Pro Lifetime',
    price: 5,
    cadence: 'one-time',
    blurb: 'Launch price. Pay once, keep Pro forever.',
    priceEnv: 'STRIPE_PRICE_LIFETIME',
  },
};

export const PRO_FEATURES = [
  'Every theme + custom colors',
  'Hide the “Powered by” badge',
  'Visitor analytics dashboard',
  'Custom domain hosting',
  'Priority GitHub refresh',
];

export const FREE_FEATURES = [
  '4 themes (Dark, Light, Midnight, Brutal)',
  'Streaks, contribution graph, top repos',
  'iframe, script and SVG embeds',
  'Works in Notion, Framer, Webflow, README',
];
