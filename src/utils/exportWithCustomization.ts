import type { ReportCustomization } from '../types/scenario';

export function generateCustomizedPDF(
  data: any,
  customization: ReportCustomization
): string {
  const {
    logo,
    primaryColor,
    secondaryColor,
    companyName,
    includeCharts,
    includePhaseBreakdown,
    includeRoiMetrics,
  } = customization;

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ROI & Staffing Model Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 40px;
      text-align: center;
    }
    ${logo ? `.logo { max-height: 60px; margin-bottom: 20px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; }` : ''}
    .company-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .report-title { font-size: 20px; opacity: 0.95; }
    .section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: ${primaryColor};
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid ${secondaryColor};
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .metric-card {
      background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);
      border-left: 4px solid ${primaryColor};
      padding: 20px;
      border-radius: 8px;
    }
    .metric-label { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-value { font-size: 32px; font-weight: bold; color: ${primaryColor}; margin-top: 5px; }
    .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .comparison-table th { background: ${primaryColor}; color: white; padding: 12px; text-align: left; }
    .comparison-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .comparison-table tr:hover { background: #f9fafb; }
    .best { color: #16a34a; font-weight: bold; }
    .worst { color: #dc2626; }
    .phase-bar {
      display: flex;
      height: 40px;
      border-radius: 8px;
      overflow: hidden;
      margin: 20px 0;
    }
    .phase-segment {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
      padding: 0 10px;
    }
    .chart-container {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    ${logo ? `<img src="${logo}" alt="Logo" class="logo" />` : ''}
    <div class="company-name">${companyName || 'Company Report'}</div>
    <div class="report-title">ROI & Staffing Model Analysis</div>
    <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">
      Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Project Overview</h2>
    <p><strong>Project Name:</strong> ${data.projectInputs?.projectName || 'N/A'}</p>
    <p><strong>Description:</strong> ${data.projectInputs?.description || 'N/A'}</p>
    <p><strong>Size:</strong> ${data.projectInputs?.tshirtSize || 'N/A'}</p>
    <p><strong>Duration:</strong> ${data.results?.duration || 'N/A'} months</p>
    <p><strong>Target Go-Live:</strong> ${data.projectInputs?.targetGoLive || 'N/A'}</p>
  </div>
`;

  if (includeRoiMetrics) {
    html += `
  <div class="section">
    <h2 class="section-title">Key Metrics</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Total Cost</div>
        <div class="metric-value">$${(data.results?.totalCost || 0).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">ROI Percentage</div>
        <div class="metric-value">${(data.results?.roiPercentage || 0).toFixed(1)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Payback Period</div>
        <div class="metric-value">${(data.results?.paybackPeriod || 0).toFixed(1)} mo</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Net Present Value</div>
        <div class="metric-value">$${(data.results?.npv || 0).toLocaleString()}</div>
      </div>
    </div>
  </div>
`;
  }

  if (includePhaseBreakdown && data.results?.phases) {
    const phases = data.results.phases;
    const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
    
    html += `
  <div class="section">
    <h2 class="section-title">Phase Breakdown</h2>
    <div class="phase-bar">
`;
    phases.forEach((phase: any, idx: number) => {
      const percentage = ((phase.cost / data.results.totalCost) * 100).toFixed(1);
      html += `
      <div class="phase-segment" style="width: ${percentage}%; background-color: ${colors[idx % colors.length]}">
        ${phase.name}<br/>${percentage}%
      </div>
`;
    });
    html += `
    </div>
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Duration</th>
          <th>Cost</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
`;
    phases.forEach((phase: any) => {
      html += `
        <tr>
          <td><strong>${phase.name}</strong></td>
          <td>${phase.duration} months</td>
          <td>$${phase.cost.toLocaleString()}</td>
          <td>${phase.startDate}</td>
          <td>${phase.endDate}</td>
        </tr>
`;
    });
    html += `
      </tbody>
    </table>
  </div>
`;
  }

  if (data.staffingModels) {
    html += `
  <div class="section">
    <h2 class="section-title">Staffing Model Comparison</h2>
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Total Cost</th>
          <th>Monthly Burn</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
`;
    ['directHire', 'contractor', 'vendor'].forEach((model) => {
      const modelData = data.staffingModels[model];
      if (modelData) {
        html += `
        <tr>
          <td><strong>${model === 'directHire' ? 'Direct Hire' : model === 'contractor' ? 'Contractor' : 'Vendor'}</strong></td>
          <td>$${(modelData.totalCost || 0).toLocaleString()}</td>
          <td>$${(modelData.monthlyBurn || 0).toLocaleString()}</td>
          <td>${modelData.duration || 0} months</td>
          <td>${modelData.meetsDeadline ? '✓ On Track' : '⚠ Delayed'}</td>
        </tr>
`;
      }
    });
    html += `
      </tbody>
    </table>
  </div>
`;
  }

  html += `
  <div class="footer">
    <p>This report was generated by the ROI & Staffing Model Calculator</p>
    <p>For questions or additional analysis, contact your project planning team</p>
  </div>
</body>
</html>
`;

  return html;
}

export function generateCustomizedCSV(
  data: any,
  customization: ReportCustomization
): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`"${customization.companyName || 'Company'} - ROI & Staffing Model Report"`);
  lines.push(`"Generated: ${new Date().toISOString()}"`);
  lines.push('');

  // Project Info
  lines.push('"Project Information"');
  lines.push(`"Project Name","${data.projectInputs?.projectName || ''}"`);
  lines.push(`"Description","${data.projectInputs?.description || ''}"`);
  lines.push(`"T-Shirt Size","${data.projectInputs?.tshirtSize || ''}"`);
  lines.push(`"Duration","${data.results?.duration || ''} months"`);
  lines.push('');

  // Key Metrics
  if (customization.includeRoiMetrics) {
    lines.push('"Key Metrics"');
    lines.push('"Metric","Value"');
    lines.push(`"Total Project Cost","$${(data.results?.totalCost || 0).toLocaleString()}"`);
    lines.push(`"ROI Percentage","${(data.results?.roiPercentage || 0).toFixed(2)}%"`);
    lines.push(`"Payback Period","${(data.results?.paybackPeriod || 0).toFixed(1)} months"`);
    lines.push(`"Net Present Value","$${(data.results?.npv || 0).toLocaleString()}"`);
    lines.push('');
  }

  // Phase Breakdown
  if (customization.includePhaseBreakdown && data.results?.phases) {
    lines.push('"Phase Breakdown"');
    lines.push('"Phase","Duration (months)","Cost","Start Date","End Date"');
    data.results.phases.forEach((phase: any) => {
      lines.push(`"${phase.name}","${phase.duration}","$${phase.cost.toLocaleString()}","${phase.startDate}","${phase.endDate}"`);
    });
    lines.push('');
  }

  // Staffing Models
  lines.push('"Staffing Model Comparison"');
  lines.push('"Model","Total Cost","Monthly Burn","Duration (months)","Meets Deadline"');
  ['directHire', 'contractor', 'vendor'].forEach((model) => {
    const modelData = data.staffingModels?.[model];
    if (modelData) {
      const modelName = model === 'directHire' ? 'Direct Hire' : model === 'contractor' ? 'Contractor' : 'Vendor';
      lines.push(`"${modelName}","$${(modelData.totalCost || 0).toLocaleString()}","$${(modelData.monthlyBurn || 0).toLocaleString()}","${modelData.duration || 0}","${modelData.meetsDeadline ? 'Yes' : 'No'}"`);
    }
  });

  return lines.join('\n');
}

export function downloadCustomizedPDF(data: any, customization: ReportCustomization, filename: string) {
  const html = generateCustomizedPDF(data, customization);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCustomizedCSV(data: any, customization: ReportCustomization, filename: string) {
  const csv = generateCustomizedCSV(data, customization);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
