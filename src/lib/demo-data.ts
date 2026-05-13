// Demo data initialization for billing portal
import type { Subscription, PaymentMethod, BillingHistory } from "../types/billing";

const DEMO_USER_ID = "demo-user-123";

export const createDemoSubscription = (): Omit<Subscription, 'id' | 'created_at' | 'updated_at'> => {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return {
    userId: DEMO_USER_ID,
    planId: "professional",
    planName: "Professional",
    status: "active",
    billingCycle: "monthly",
    amount: 49,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: "false",
  };
};

export const createDemoPaymentMethod = (): Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'> => {
  return {
    userId: DEMO_USER_ID,
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: "12",
    expiryYear: "2026",
    isDefault: "true",
  };
};

export const createDemoBillingHistory = (): Array<Omit<BillingHistory, 'id' | 'created_at' | 'updated_at'>> => {
  const history: Array<Omit<BillingHistory, 'id' | 'created_at' | 'updated_at'>> = [];
  
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    history.push({
      userId: DEMO_USER_ID,
      invoiceNumber: `INV-${1000 + i}`,
      invoiceDate: date.toISOString(),
      amount: 49,
      status: "paid",
      description: "Professional Plan - Monthly Subscription",
      pdfUrl: `/invoices/INV-${1000 + i}.pdf`,
    });
  }
  
  return history;
};
