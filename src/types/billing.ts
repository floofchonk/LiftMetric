export type PlanId = "free" | "professional" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
  recommended?: boolean;
  maxScenarios: number;
  maxExports: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
};

export type Subscription = {
  id: number;
  userId: string;
  planId: string;
  planName: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  billingCycle: "monthly" | "annual";
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: string;
  created_at: string;
  updated_at: string;
};

export type PaymentMethod = {
  id: number;
  userId: string;
  type: "card" | "bank_account";
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: string;
  created_at: string;
  updated_at: string;
};

export type BillingHistory = {
  id: number;
  userId: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  description: string;
  pdfUrl: string;
  created_at: string;
  updated_at: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    maxScenarios: 3,
    maxExports: 5,
    advancedAnalytics: false,
    prioritySupport: false,
    features: [
      "Up to 3 saved scenarios",
      "5 exports per month",
      "Basic ROI calculations",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49,
    billingCycle: "monthly",
    maxScenarios: 25,
    maxExports: 100,
    advancedAnalytics: true,
    prioritySupport: false,
    recommended: true,
    features: [
      "Up to 25 saved scenarios",
      "100 exports per month",
      "Advanced analytics & charts",
      "Scenario comparison",
      "PDF & CSV exports",
      "Priority email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    billingCycle: "monthly",
    maxScenarios: -1, // unlimited
    maxExports: -1, // unlimited
    advancedAnalytics: true,
    prioritySupport: true,
    features: [
      "Unlimited scenarios",
      "Unlimited exports",
      "Advanced analytics & charts",
      "Multi-user collaboration",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
];
