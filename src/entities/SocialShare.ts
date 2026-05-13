import type { EntityConfig } from "../hooks/useEntity";

export const socialShareEntityConfig: EntityConfig = {
  name: "SocialShare",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User who shared" },
    platform: {
      type: "string",
      enum: ["twitter", "linkedin", "facebook", "email"],
      description: "Social media platform",
    },
    shareType: {
      type: "string",
      enum: ["calculation", "insight", "milestone", "referral", "testimonial"],
      description: "Type of content shared",
    },
    content: { type: "string", description: "Shared content text" },
    calculationData: { type: "string", description: "JSON string of calculation details" },
    clicks: { type: "integer", default: "0", description: "Number of clicks on shared link" },
    conversions: { type: "integer", default: "0", description: "Conversions from this share" },
    shareUrl: { type: "string", description: "Generated share URL" },
  },
  required: ["userId", "platform", "shareType", "content"],
};
