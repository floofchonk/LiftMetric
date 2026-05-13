import type { EntityConfig } from "../hooks/useEntity";

export const dashboardWidgetEntityConfig: EntityConfig = {
  name: "DashboardWidget",
  orderBy: "position ASC",
  properties: {
    userId: { type: "string", description: "User ID who owns this widget" },
    widgetType: {
      type: "string",
      enum: [
        "recentActivity",
        "quickStats",
        "frequentCalculations",
        "savedScenarios",
        "recentResults",
        "usageTrends",
        "quickActions",
        "tips",
      ],
      description: "Type of widget",
    },
    position: { type: "integer", description: "Display order position" },
    isVisible: { type: "string", default: "true", description: "Widget visibility" },
    settings: { type: "string", default: "{}", description: "Widget-specific settings JSON" },
  },
  required: ["userId", "widgetType", "position"],
};
