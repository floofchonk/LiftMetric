import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key (use environment variable in production)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Price IDs for different plans (these would come from your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  basic_monthly: import.meta.env.VITE_STRIPE_BASIC_MONTHLY || 'price_basic_monthly',
  basic_annual: import.meta.env.VITE_STRIPE_BASIC_ANNUAL || 'price_basic_annual',
  pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY || 'price_pro_monthly',
  pro_annual: import.meta.env.VITE_STRIPE_PRO_ANNUAL || 'price_pro_annual',
};

// Product IDs
export const STRIPE_PRODUCT_IDS = {
  basic: 'prod_basic',
  pro: 'prod_pro',
};
