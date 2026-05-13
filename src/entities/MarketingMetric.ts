import type { EntityConfig } from "../hooks/useEntity";

export const marketingMetricEntityConfig: EntityConfig = {
  name: "MarketingMetric",
  orderBy: "created_at DESC",
  properties: {
    date: { type: "string", format: "date", description: "Metric date" },
    metricType: {
      type: "string",
      enum: [
        "signup",
        "referral",
        "social_share",
        "conversion",
        "trial_start",
        "upgrade",
        "churn",
        "page_view",
        "feature_usage",
      ],
      description: "Type of metric",
    },
    source: {
      type: "string",
      description: "Traffic source (organic, social, referral, direct, email, paid)",
    },
    value: { type: "number", description: "Metric value" },
    metadata: { type: "string", description: "JSON string with additional data" },
    userId: { type: "string", description: "Associated user ID if applicable" },
    campaignId: { type: "string", description: "Marketing campaign ID if applicable" },
  },
  required: ["date", "metricType", "value"],
};
