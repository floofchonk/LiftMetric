import type { EntityConfig } from "../hooks/useEntity";

export const referralEntityConfig: EntityConfig = {
  name: "Referral",
  orderBy: "created_at DESC",
  properties: {
    referrerId: { type: "integer", description: "User who sent referral" },
    referredUserId: { type: "integer", description: "User who signed up via referral" },
    referralCode: { type: "string", description: "Unique referral code" },
    status: {
      type: "string",
      enum: ["pending", "completed", "rewarded"],
      default: "pending",
      description: "Referral status",
    },
    referrerReward: { type: "string", description: "Reward given to referrer" },
    referredReward: { type: "string", description: "Reward given to referred user" },
    completedAt: { type: "string", description: "When referral completed" },
    rewardedAt: { type: "string", description: "When rewards were given" },
  },
  required: ["referrerId", "referralCode"],
};
