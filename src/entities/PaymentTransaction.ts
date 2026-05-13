import type { EntityConfig } from "../hooks/useEntity";

export const paymentTransactionEntityConfig: EntityConfig = {
  name: "PaymentTransaction",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    stripePaymentIntentId: { type: "string", description: "Stripe payment intent ID" },
    stripeCustomerId: { type: "string", description: "Stripe customer ID" },
    amount: { type: "number", description: "Amount in cents" },
    currency: { type: "string", default: "usd", description: "Currency code" },
    status: {
      type: "string",
      enum: ["pending", "processing", "succeeded", "failed", "canceled", "refunded"],
      default: "pending",
      description: "Payment status",
    },
    paymentMethod: { type: "string", description: "Payment method type (card, etc)" },
    planType: { type: "string", description: "Plan purchased (Basic, Pro)" },
    billingInterval: { type: "string", description: "monthly or annual" },
    errorMessage: { type: "string", description: "Error message if failed" },
    metadata: { type: "string", description: "JSON metadata" },
  },
  required: ["userId", "amount", "status"],
};
