import type { EntityConfig } from "../hooks/useEntity";

export const userAcquisitionEntityConfig: EntityConfig = {
  name: "UserAcquisition",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    signupDate: { type: "string", format: "date", description: "Signup date" },
    source: {
      type: "string",
      enum: ["organic", "social_twitter", "social_linkedin", "referral", "direct", "email", "paid_search", "paid_social"],
      description: "Acquisition source",
    },
    campaign: { type: "string", description: "Campaign identifier" },
    referrerId: { type: "string", description: "Referring user ID if from referral" },
    landingPage: { type: "string", description: "First page visited" },
    tier: {
      type: "string",
      enum: ["free", "trial", "basic", "pro", "enterprise"],
      default: "free",
      description: "Initial tier",
    },
    converted: { type: "string", default: "false", description: "Converted to paid" },
    conversionDate: { type: "string", format: "date", description: "Date of conversion to paid" },
    lifetimeValue: { type: "number", default: "0", description: "Customer lifetime value" },
  },
  required: ["userId", "signupDate", "source"],
};
