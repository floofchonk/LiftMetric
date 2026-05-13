export interface Scenario {
  id: string;
  name: string;
  inputs?: any;
  results?: any;
  createdAt: string;
  lastModified: string;
  updatedAt?: string;
  description?: string;
  mode?: 'basic' | 'scientific';
  tags?: string[];
  projectInputs?: any;
  roles?: any[];
  locations?: any[];
  tshirtSizes?: any[];
  costModels?: any;
  roiInputs?: any;
  customization?: ReportCustomization;
}

export interface ReportCustomization {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  companyName?: string;
  showBranding?: boolean;
  chartType?: 'bar' | 'line' | 'pie';
  includeCharts?: boolean;
  includePhaseBreakdown?: boolean;
  includeRoiMetrics?: boolean;
}
