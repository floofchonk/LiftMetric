import type { EntityConfig } from "../hooks/useEntity";

export const userPreferenceEntityConfig: EntityConfig = {
  name: "UserPreference",
  properties: {
    userId: { type: "string", description: "User ID" },
    preferenceKey: { type: "string", description: "Preference identifier" },
    preferenceValue: { type: "string", description: "Preference value" },
  },
  required: ["userId", "preferenceKey", "preferenceValue"],
};
