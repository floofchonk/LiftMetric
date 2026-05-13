import type { EntityConfig } from "../hooks/useEntity";

export const brandSettingsEntityConfig: EntityConfig = {
  name: "BrandSettings",
  orderBy: "updated_at DESC",
  properties: {
    userId: { type: "string", description: "User ID who owns these settings" },
    companyName: { type: "string", description: "Company name" },
    logoUrl: { type: "string", description: "URL to company logo" },
    primaryColor: { type: "string", default: "#3B82F6", description: "Primary brand color" },
    secondaryColor: { type: "string", default: "#8B5CF6", description: "Secondary brand color" },
    isActive: { type: "string", default: "true", description: "Active settings flag" },
  },
  required: ["userId"],
};
