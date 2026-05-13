import type { EntityConfig } from "../hooks/useEntity";

export const reportTemplateEntityConfig: EntityConfig = {
  name: "ReportTemplate",
  orderBy: "updated_at DESC",
  properties: {
    name: { type: "string", description: "Template name" },
    description: { type: "string", description: "Template description" },
    isDefault: { type: "string", description: "Is default template" },
    
    // Branding
    companyName: { type: "string", description: "Company name" },
    logoUrl: { type: "string", description: "Company logo URL" },
    primaryColor: { type: "string", description: "Primary brand color" },
    secondaryColor: { type: "string", description: "Secondary brand color" },
    accentColor: { type: "string", description: "Accent color" },
    
    // Layout Options
    layout: { type: "string", description: "Report layout style" },
    headerStyle: { type: "string", description: "Header alignment" },
    fontSize: { type: "string", description: "Base font size" },
    showPageNumbers: { type: "string", description: "Show page numbers" },
    showFooter: { type: "string", description: "Show footer" },
    
    // Sections to Include
    includeSummary: { type: "string", description: "Include executive summary" },
    includeCharts: { type: "string", description: "Include charts" },
    includeBreakdown: { type: "string", description: "Include cost breakdown" },
    includeBenchmark: { type: "string", description: "Include benchmark comparison" },
    includeScenarios: { type: "string", description: "Include scenario analysis" },
    includeRecommendations: { type: "string", description: "Include recommendations" },
    includeAppendix: { type: "string", description: "Include appendix" },
    
    // Metrics to Display
    metricsToShow: { type: "string", description: "JSON array of metric keys to display prominently" },
    chartTypes: { type: "string", description: "JSON array of chart types to include" },
    
    // Custom Content
    customHeader: { type: "string", description: "Custom header text" },
    customFooter: { type: "string", description: "Custom footer text" },
    disclaimer: { type: "string", description: "Legal disclaimer text" },
    
    // Metadata
    usageCount: { type: "integer", description: "Number of times used" },
    lastUsedAt: { type: "string", description: "Last usage timestamp" },
  },
  required: ["name", "layout"],
};
