import { getStripe, STRIPE_PRICE_IDS } from './stripeConfig';

export type PlanType = 'basic' | 'pro';
export type BillingInterval = 'monthly' | 'annual';

interface CreateCheckoutSessionParams {
  planType: PlanType;
  billingInterval: BillingInterval;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

// In a real application, this would call your backend API
// The backend would create a Stripe checkout session and return the session ID
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
  // Simulate API call to backend
  // In production, this would be: const response = await fetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify(params) });
  
  const priceId = getPriceId(params.planType, params.billingInterval);
  
  // Mock response - in production, your backend creates this
  return {
    sessionId: `cs_test_${Date.now()}`,
    url: '/payment/processing', // In production, this would be the Stripe checkout URL
  };
}

export function getPriceId(planType: PlanType, billingInterval: BillingInterval): string {
  const key = `${planType}_${billingInterval}` as keyof typeof STRIPE_PRICE_IDS;
  return STRIPE_PRICE_IDS[key];
}

export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }
  
  // In production, redirect to Stripe Checkout URL
  // For demo purposes, we simulate the checkout process
  window.location.href = '/payment/processing';
}

export function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function getPaymentErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    card_declined: 'Your card was declined. Please try another payment method.',
    insufficient_funds: 'Your card has insufficient funds. Please use another payment method.',
    expired_card: 'Your card has expired. Please update your payment method.',
    incorrect_cvc: 'The security code is incorrect. Please check and try again.',
    processing_error: 'An error occurred while processing your payment. Please try again.',
    invalid_number: 'The card number is invalid. Please check and try again.',
    generic_decline: 'Your card was declined. Please contact your bank or try another payment method.',
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again or contact support.';
}
