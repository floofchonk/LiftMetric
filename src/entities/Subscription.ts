import type { EntityConfig } from "../hooks/useEntity";

export const subscriptionEntityConfig: EntityConfig = {
  name: "Subscription",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User identifier" },
    planId: { type: "string", description: "Plan identifier (free, professional, enterprise)" },
    planName: { type: "string", description: "Display name of plan" },
    status: { 
      type: "string", 
      enum: ["active", "canceled", "past_due", "trialing"],
      description: "Subscription status" 
    },
    billingCycle: { 
      type: "string", 
      enum: ["monthly", "annual"],
      description: "Billing frequency" 
    },
    amount: { type: "number", description: "Subscription amount" },
    currentPeriodStart: { type: "string", format: "date", description: "Current billing period start" },
    currentPeriodEnd: { type: "string", format: "date", description: "Current billing period end" },
    cancelAtPeriodEnd: { type: "string", description: "Whether subscription cancels at period end" },
  },
  required: ["userId", "planId", "planName", "status", "billingCycle", "amount"],
};
