// Feature comparison data for pricing tiers
// Update features here and the comparison table updates automatically

export interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    description?: string;
    free: boolean;
    basic: boolean;
    pro: boolean;
  }[];
}

export const comparisonFeatures: ComparisonFeature[] = [
  {
    category: 'Core Features',
    features: [
      {
        name: 'ROI Calculator',
        description: 'Basic implementation analysis',
        free: true,
        basic: true,
        pro: true,
      },
      {
        name: 'Calculations per Month',
        description: '5 vs 50 vs Unlimited',
        free: true,
        basic: true,
        pro: true,
      },
      {
        name: 'Saved Scenarios',
        description: 'Store calculation results',
        free: false,
        basic: true,
        pro: true,
      },
      {
        name: 'Scenario Comparison',
        description: 'Side-by-side analysis',
        free: false,
        basic: false,
        pro: true,
      },
    ],
  },
  {
    category: 'Advanced Analytics',
    features: [
      {
        name: 'Sensitivity Analysis',
        description: 'What-if scenario modeling',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Historical Trends',
        description: 'Track changes over time',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Trend Forecasting',
        description: 'Predict future outcomes',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Custom Templates',
        description: 'Create reusable workflows',
        free: false,
        basic: false,
        pro: true,
      },
    ],
  },
  {
    category: 'Data & Storage',
    features: [
      {
        name: 'History Retention',
        description: 'Keep calculation history',
        free: false,
        basic: true,
        pro: true,
      },
      {
        name: 'Data Export',
        description: 'PDF format only',
        free: true,
        basic: true,
        pro: true,
      },
      {
        name: 'Advanced Exports',
        description: 'Excel, CSV, JSON formats',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Unlimited Storage',
        description: 'Store all your scenarios',
        free: false,
        basic: false,
        pro: true,
      },
    ],
  },
  {
    category: 'Collaboration & API',
    features: [
      {
        name: 'API Access',
        description: 'Integrate with your tools',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Team Collaboration',
        description: 'Share calculations',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'White-Label Reports',
        description: 'Brand reports as your own',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Unlimited Team Members',
        description: 'Add as many users as needed',
        free: false,
        basic: false,
        pro: true,
      },
    ],
  },
  {
    category: 'Support & SLA',
    features: [
      {
        name: 'Email Support',
        description: 'Community-based help',
        free: true,
        basic: true,
        pro: true,
      },
      {
        name: 'Priority Support',
        description: '24-hour response time',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'Dedicated Manager',
        description: 'Assigned account manager',
        free: false,
        basic: false,
        pro: true,
      },
      {
        name: 'SLA Guarantee',
        description: '99.9% uptime SLA',
        free: false,
        basic: false,
        pro: true,
      },
    ],
  },
];

// Helper to get all unique features
export const getAllFeatures = () => {
  return comparisonFeatures.flatMap(cat =>
    cat.features.map(feat => ({
      ...feat,
      category: cat.category,
    }))
  );
};
