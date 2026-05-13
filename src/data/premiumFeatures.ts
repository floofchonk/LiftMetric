export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  requiredPlan: 'Basic' | 'Pro' | 'Enterprise';
  benefits: string[];
  category: 'calculation' | 'export' | 'storage' | 'analytics' | 'collaboration';
}

export const premiumFeatures: Record<string, PremiumFeature> = {
  advancedCalculations: {
    id: 'advancedCalculations',
    name: 'Advanced Calculations',
    description: 'Access advanced scientific functions, custom formulas, and complex metric calculations beyond the basic set.',
    requiredPlan: 'Pro',
    benefits: [
      'Unlimited calculation complexity',
      'Custom formula builder',
      'Advanced scientific functions',
      'Multi-variable sensitivity analysis',
      'Real-time calculation validation'
    ],
    category: 'calculation'
  },
  unlimitedHistory: {
    id: 'unlimitedHistory',
    name: 'Extended History Storage',
    description: 'Keep all your calculation history forever with unlimited storage and advanced search capabilities.',
    requiredPlan: 'Pro',
    benefits: [
      'Unlimited history retention',
      'Advanced search and filtering',
      'Historical trend analysis',
      'Compare calculations across time',
      'Export complete history'
    ],
    category: 'storage'
  },
  excelExport: {
    id: 'excelExport',
    name: 'Excel Export',
    description: 'Export your calculations and scenarios to Excel format for further analysis and reporting.',
    requiredPlan: 'Pro',
    benefits: [
      'Export to .xlsx format',
      'Formatted spreadsheets',
      'Include charts and graphs',
      'Batch export multiple scenarios',
      'Custom export templates'
    ],
    category: 'export'
  },
  csvExport: {
    id: 'csvExport',
    name: 'CSV Export',
    description: 'Download your data in CSV format for integration with other tools and systems.',
    requiredPlan: 'Basic',
    benefits: [
      'Export to .csv format',
      'Compatible with all spreadsheet apps',
      'Bulk data export',
      'Automated export scheduling',
      'Custom field selection'
    ],
    category: 'export'
  },
  apiAccess: {
    id: 'apiAccess',
    name: 'API Access',
    description: 'Integrate Lift Metric with your existing tools and workflows using our powerful REST API.',
    requiredPlan: 'Enterprise',
    benefits: [
      'Full REST API access',
      'Webhook integrations',
      'Real-time data sync',
      'Custom integrations',
      'Dedicated API support'
    ],
    category: 'collaboration'
  },
  unlimitedScenarios: {
    id: 'unlimitedScenarios',
    name: 'Unlimited Scenarios',
    description: 'Save and compare unlimited scenarios to explore different outcomes and make better decisions.',
    requiredPlan: 'Pro',
    benefits: [
      'Unlimited saved scenarios',
      'Scenario comparison tools',
      'Organize in folders',
      'Share scenarios with team',
      'Version history tracking'
    ],
    category: 'storage'
  },
  sensitivityAnalysis: {
    id: 'sensitivityAnalysis',
    name: 'Sensitivity Analysis',
    description: 'Understand how changes in variables impact your results with advanced sensitivity analysis tools.',
    requiredPlan: 'Pro',
    benefits: [
      'Multi-variable analysis',
      'Interactive sensitivity charts',
      'What-if scenario modeling',
      'Risk assessment tools',
      'Automated insights'
    ],
    category: 'analytics'
  },
  teamCollaboration: {
    id: 'teamCollaboration',
    name: 'Team Collaboration',
    description: 'Work together with your team on calculations, share insights, and collaborate in real-time.',
    requiredPlan: 'Enterprise',
    benefits: [
      'Unlimited team members',
      'Real-time collaboration',
      'Role-based permissions',
      'Shared workspaces',
      'Activity tracking'
    ],
    category: 'collaboration'
  },
  whiteLabelReports: {
    id: 'whiteLabelReports',
    name: 'White-Label Reports',
    description: 'Generate professional, branded reports with your company logo and custom styling.',
    requiredPlan: 'Enterprise',
    benefits: [
      'Custom branding and logos',
      'Professional report templates',
      'Automated report generation',
      'Client-ready deliverables',
      'Custom styling options'
    ],
    category: 'export'
  },
  advancedCharts: {
    id: 'advancedCharts',
    name: 'Advanced Charts & Visualizations',
    description: 'Create stunning visualizations with advanced chart types and customization options.',
    requiredPlan: 'Pro',
    benefits: [
      '15+ chart types',
      'Interactive visualizations',
      'Custom color schemes',
      'Export high-res images',
      'Animated data transitions'
    ],
    category: 'analytics'
  }
};

// Helper function to check if a feature is available for a user
export const isFeatureAvailable = (
  featureId: string,
  userPlan: 'Free' | 'Basic' | 'Pro' | 'Enterprise'
): boolean => {
  const feature = premiumFeatures[featureId];
  if (!feature) return true; // Unknown features are available by default

  const planHierarchy = ['Free', 'Basic', 'Pro', 'Enterprise'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);
  const requiredPlanIndex = planHierarchy.indexOf(feature.requiredPlan);

  return userPlanIndex >= requiredPlanIndex;
};

// Helper function to get the required plan for a feature
export const getRequiredPlan = (featureId: string): 'Basic' | 'Pro' | 'Enterprise' | null => {
  const feature = premiumFeatures[featureId];
  return feature ? feature.requiredPlan : null;
};
