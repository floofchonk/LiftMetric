import type { EntityConfig } from "../hooks/useEntity";

export const paymentMethodEntityConfig: EntityConfig = {
  name: "PaymentMethod",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User identifier" },
    type: { 
      type: "string", 
      enum: ["card", "bank_account"],
      description: "Payment method type" 
    },
    last4: { type: "string", description: "Last 4 digits of card/account" },
    brand: { type: "string", description: "Card brand (Visa, Mastercard, etc.)" },
    expiryMonth: { type: "string", description: "Card expiry month" },
    expiryYear: { type: "string", description: "Card expiry year" },
    isDefault: { type: "string", description: "Whether this is the default payment method" },
  },
  required: ["userId", "type", "last4"],
};
