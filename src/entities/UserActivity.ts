import type { EntityConfig } from "../hooks/useEntity";

export const userActivityEntityConfig: EntityConfig = {
  name: "UserActivity",
  orderBy: "created_at DESC",
  properties: {
    userId: { type: "string", description: "User ID" },
    activityType: {
      type: "string",
      enum: [
        "calculation",
        "scenario_saved",
        "scenario_loaded",
        "export",
        "comparison",
        "feature_used",
      ],
      description: "Type of activity",
    },
    title: { type: "string", description: "Activity title" },
    description: { type: "string", description: "Activity description" },
    metadata: { type: "string", default: "{}", description: "Additional activity data JSON" },
  },
  required: ["userId", "activityType", "title"],
};
