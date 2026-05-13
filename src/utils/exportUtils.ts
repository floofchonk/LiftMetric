import type { CalculationResults, ProjectInputs, Role } from '../types/calculator';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface CalculationHistoryItem {
  id: string;
  timestamp: Date;
  projectName: string;
  inputs: ProjectInputs;
  results: CalculationResults;
  notes?: string;
}

// Export results to CSV
export function exportResultsToCSV(
  results: CalculationResults,
  inputs: ProjectInputs,
  options: ExportOption[],
  roles: Role[] = []
): void {
  const selectedIds = options.map(opt => opt.id);
  let csvContent = '';

  // Header
  csvContent += 'Lift Metric - ROI Calculation Results\n';
  csvContent += `Export Date: ${new Date().toLocaleString()}\n`;
  csvContent += `Project: ${inputs.projectName || 'Unnamed Project'}\n\n`;

  // Input Values Section
  if (selectedIds.includes('inputs')) {
    csvContent += '=== INPUT PARAMETERS ===\n';
    csvContent += `Project Name,${inputs.projectName || 'N/A'}\n`;
    csvContent += `Start Date,${inputs.startDate || 'N/A'}\n`;
    csvContent += `Project Duration,${inputs.projectDuration || 'N/A'} months\n`;
    csvContent += `Initial Investment,$${inputs.initialInvestment?.toLocaleString() || '0'}\n`;
    csvContent += `Annual Revenue,$${inputs.annualRevenue?.toLocaleString() || '0'}\n`;
    csvContent += `Operating Costs,$${inputs.operatingCosts?.toLocaleString() || '0'}\n`;
    csvContent += `Discount Rate,${inputs.discountRate || '0'}%\n\n`;
  }

  // Summary Section
  if (selectedIds.includes('summary')) {
    csvContent += '=== EXECUTIVE SUMMARY ===\n';
    csvContent += `Total ROI,${results.roi.percentage.toFixed(2)}%\n`;
    csvContent += `ROI Amount,$${results.roi.amount.toLocaleString()}\n`;
    csvContent += `Payback Period,${(results.roi.amount / 12).toFixed(1)} months\n`;
    csvContent += `Net Present Value,$${results.roi.amount.toLocaleString()}\n\n`;
  }

  // Timeline Section
  if (selectedIds.includes('timeline')) {
    csvContent += '=== PROJECT TIMELINE ===\n';
    csvContent += 'Period,Revenue,Costs,Profit,Cumulative ROI\n';
    results.timeline.forEach((period, index) => {
      csvContent += `${index + 1},`;
      csvContent += `$${period.revenue.toLocaleString()},`;
      csvContent += `$${period.costs.toLocaleString()},`;
      csvContent += `$${period.profit.toLocaleString()},`;
      csvContent += `${period.cumulativeROI.toFixed(2)}%\n`;
    });
    csvContent += '\n';
  }

  // Breakdown Section
  if (selectedIds.includes('breakdown')) {
    csvContent += '=== COST BREAKDOWN ===\n';
    csvContent += 'Category,Amount,Percentage\n';
    const totalCost = results.roi.amount;
    csvContent += `Labor Costs,$${(totalCost * 0.6).toLocaleString()},60%\n`;
    csvContent += `Infrastructure,$${(totalCost * 0.25).toLocaleString()},25%\n`;
    csvContent += `Training,$${(totalCost * 0.10).toLocaleString()},10%\n`;
    csvContent += `Contingency,$${(totalCost * 0.05).toLocaleString()},5%\n\n`;
  }

  // Roles Section
  if (selectedIds.includes('inputs') && roles.length > 0) {
    csvContent += '=== STAFFING ALLOCATION ===\n';
    csvContent += 'Role,Type,Rate,Hours,Total Cost\n';
    roles.forEach(role => {
      const hours = role.hours || 0;
      const rate = role.rate || 0;
      csvContent += `${role.name},${role.type},`;
      csvContent += `$${rate.toLocaleString()},${hours},`;
      csvContent += `$${(hours * rate).toLocaleString()}\n`;
    });
  }

  // Download the file
  downloadFile(csvContent, `lift-metric-results-${Date.now()}.csv`, 'text/csv');
}

// Export history to CSV
export function exportHistoryToCSV(
  history: CalculationHistoryItem[],
  options: ExportOption[]
): void {
  const selectedIds = options.map(opt => opt.id);
  let csvContent = '';

  // Header
  csvContent += 'Lift Metric - Calculation History\n';
  csvContent += `Export Date: ${new Date().toLocaleString()}\n`;
  csvContent += `Total Calculations: ${history.length}\n\n`;

  // Column headers
  const headers = ['Calculation #'];
  if (selectedIds.includes('timestamps')) headers.push('Date', 'Time');
  if (selectedIds.includes('inputs')) headers.push('Project Name', 'Investment', 'Revenue', 'Duration');
  if (selectedIds.includes('results')) headers.push('ROI %', 'ROI Amount', 'Payback Period', 'NPV');
  if (selectedIds.includes('metadata')) headers.push('Notes', 'Status');
  csvContent += headers.join(',') + '\n';

  // Data rows
  history.forEach((item, index) => {
    const row = [`#${index + 1}`];
    
    if (selectedIds.includes('timestamps')) {
      const date = new Date(item.timestamp);
      row.push(date.toLocaleDateString());
      row.push(date.toLocaleTimeString());
    }
    
    if (selectedIds.includes('inputs')) {
      row.push(`"${item.projectName || 'Unnamed'}"`);
      row.push(`$${item.inputs.initialInvestment?.toLocaleString() || '0'}`);
      row.push(`$${item.inputs.annualRevenue?.toLocaleString() || '0'}`);
      row.push(`${item.inputs.projectDuration || 0} months`);
    }
    
    if (selectedIds.includes('results')) {
      row.push(`${item.results.roi.percentage.toFixed(2)}%`);
      row.push(`$${item.results.roi.amount.toLocaleString()}`);
      const payback = item.results.roi.amount / 12;
      row.push(`${payback.toFixed(1)} months`);
      row.push(`$${item.results.roi.amount.toLocaleString()}`);
    }
    
    if (selectedIds.includes('metadata')) {
      row.push(`"${item.notes || 'N/A'}"`);
      row.push('Completed');
    }
    
    csvContent += row.join(',') + '\n';
  });

  // Summary statistics
  csvContent += '\n=== SUMMARY STATISTICS ===\n';
  const avgROI = history.reduce((sum, item) => sum + item.results.roi.percentage, 0) / history.length;
  const totalInvestment = history.reduce((sum, item) => sum + (item.inputs.initialInvestment || 0), 0);
  csvContent += `Average ROI,${avgROI.toFixed(2)}%\n`;
  csvContent += `Total Investment Analyzed,$${totalInvestment.toLocaleString()}\n`;
  csvContent += `Date Range,${new Date(history[0]?.timestamp).toLocaleDateString()} to ${new Date(history[history.length - 1]?.timestamp).toLocaleDateString()}\n`;

  downloadFile(csvContent, `lift-metric-history-${Date.now()}.csv`, 'text/csv');
}

// Export results to PDF (simplified text-based PDF)
export function exportResultsToPDF(
  results: CalculationResults,
  inputs: ProjectInputs,
  options: ExportOption[],
  roles: Role[] = []
): void {
  const selectedIds = options.map(opt => opt.id);
  
  // For now, we'll create a formatted text version
  // In production, you'd use jsPDF or similar
  let pdfContent = '';

  pdfContent += '╔═══════════════════════════════════════════════════════╗\n';
  pdfContent += '║         LIFT METRIC - ROI ANALYSIS REPORT            ║\n';
  pdfContent += '╚═══════════════════════════════════════════════════════╝\n\n';
  
  pdfContent += `Generated: ${new Date().toLocaleString()}\n`;
  pdfContent += `Project: ${inputs.projectName || 'Unnamed Project'}\n\n`;

  if (selectedIds.includes('summary')) {
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    pdfContent += 'EXECUTIVE SUMMARY\n';
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    pdfContent += `Return on Investment:    ${results.roi.percentage.toFixed(2)}%\n`;
    pdfContent += `ROI Amount:              $${results.roi.amount.toLocaleString()}\n`;
    pdfContent += `Payback Period:          ${(results.roi.amount / 12).toFixed(1)} months\n`;
    pdfContent += `Net Present Value:       $${results.roi.amount.toLocaleString()}\n\n`;
  }

  if (selectedIds.includes('inputs')) {
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    pdfContent += 'INPUT PARAMETERS\n';
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    pdfContent += `Initial Investment:      $${inputs.initialInvestment?.toLocaleString() || '0'}\n`;
    pdfContent += `Annual Revenue:          $${inputs.annualRevenue?.toLocaleString() || '0'}\n`;
    pdfContent += `Operating Costs:         $${inputs.operatingCosts?.toLocaleString() || '0'}\n`;
    pdfContent += `Project Duration:        ${inputs.projectDuration || 0} months\n`;
    pdfContent += `Discount Rate:           ${inputs.discountRate || 0}%\n`;
    pdfContent += `Start Date:              ${inputs.startDate || 'N/A'}\n\n`;
  }

  if (selectedIds.includes('breakdown')) {
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    pdfContent += 'COST BREAKDOWN\n';
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    const totalCost = results.roi.amount;
    pdfContent += `Labor Costs:             $${(totalCost * 0.6).toLocaleString().padEnd(15)} (60%)\n`;
    pdfContent += `Infrastructure:          $${(totalCost * 0.25).toLocaleString().padEnd(15)} (25%)\n`;
    pdfContent += `Training & Support:      $${(totalCost * 0.10).toLocaleString().padEnd(15)} (10%)\n`;
    pdfContent += `Contingency:             $${(totalCost * 0.05).toLocaleString().padEnd(15)} (5%)\n\n`;
  }

  if (selectedIds.includes('timeline')) {
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    pdfContent += 'PROJECT TIMELINE\n';
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    pdfContent += 'Period | Revenue      | Costs        | Profit       | ROI\n';
    pdfContent += '-------|--------------|--------------|--------------|--------\n';
    results.timeline.forEach((period, index) => {
      pdfContent += `${String(index + 1).padEnd(6)} | `;
      pdfContent += `$${period.revenue.toLocaleString().padEnd(11)} | `;
      pdfContent += `$${period.costs.toLocaleString().padEnd(11)} | `;
      pdfContent += `$${period.profit.toLocaleString().padEnd(11)} | `;
      pdfContent += `${period.cumulativeROI.toFixed(1)}%\n`;
    });
    pdfContent += '\n';
  }

  if (selectedIds.includes('charts')) {
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    pdfContent += 'KEY INSIGHTS\n';
    pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    pdfContent += '• ROI Performance: ';
    if (results.roi.percentage > 50) pdfContent += 'EXCELLENT - Well above industry average\n';
    else if (results.roi.percentage > 20) pdfContent += 'GOOD - Healthy return on investment\n';
    else pdfContent += 'MODERATE - Consider optimization opportunities\n';
    
    pdfContent += '• Payback Timeline: ';
    const payback = results.roi.amount / 12;
    if (payback < 12) pdfContent += 'FAST - Quick return on investment\n';
    else if (payback < 24) pdfContent += 'MODERATE - Standard payback period\n';
    else pdfContent += 'EXTENDED - Long-term investment horizon\n';
    
    pdfContent += '• Financial Health: ';
    if (results.roi.amount > 0) pdfContent += 'POSITIVE - Creates shareholder value\n';
    else pdfContent += 'NEGATIVE - Requires strategic review\n';
    pdfContent += '\n';
  }

  pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  pdfContent += 'Report generated by Lift Metric\n';
  pdfContent += 'Professional ROI Analysis & Financial Forecasting\n';
  pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  downloadFile(pdfContent, `lift-metric-report-${Date.now()}.txt`, 'text/plain');
}

// Export history to PDF
export function exportHistoryToPDF(
  history: CalculationHistoryItem[],
  options: ExportOption[]
): void {
  const selectedIds = options.map(opt => opt.id);
  let pdfContent = '';

  pdfContent += '╔═══════════════════════════════════════════════════════╗\n';
  pdfContent += '║      LIFT METRIC - CALCULATION HISTORY REPORT        ║\n';
  pdfContent += '╚═══════════════════════════════════════════════════════╝\n\n';
  
  pdfContent += `Generated: ${new Date().toLocaleString()}\n`;
  pdfContent += `Total Calculations: ${history.length}\n\n`;

  history.forEach((item, index) => {
    pdfContent += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    pdfContent += `CALCULATION #${index + 1}\n`;
    pdfContent += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (selectedIds.includes('timestamps')) {
      pdfContent += `Date/Time: ${new Date(item.timestamp).toLocaleString()}\n`;
    }

    if (selectedIds.includes('metadata')) {
      pdfContent += `Project: ${item.projectName || 'Unnamed'}\n`;
      if (item.notes) pdfContent += `Notes: ${item.notes}\n`;
    }

    if (selectedIds.includes('inputs')) {
      pdfContent += `\nInputs:\n`;
      pdfContent += `  Investment: $${item.inputs.initialInvestment?.toLocaleString() || '0'}\n`;
      pdfContent += `  Revenue: $${item.inputs.annualRevenue?.toLocaleString() || '0'}\n`;
      pdfContent += `  Duration: ${item.inputs.projectDuration || 0} months\n`;
    }

    if (selectedIds.includes('results')) {
      pdfContent += `\nResults:\n`;
      pdfContent += `  ROI: ${item.results.roi.percentage.toFixed(2)}%\n`;
      pdfContent += `  ROI Amount: $${item.results.roi.amount.toLocaleString()}\n`;
      pdfContent += `  Payback: ${(item.results.roi.amount / 12).toFixed(1)} months\n`;
    }

    pdfContent += '\n';
  });

  pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  pdfContent += 'SUMMARY STATISTICS\n';
  pdfContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

  const avgROI = history.reduce((sum, item) => sum + item.results.roi.percentage, 0) / history.length;
  const totalInvestment = history.reduce((sum, item) => sum + (item.inputs.initialInvestment || 0), 0);
  
  pdfContent += `Average ROI: ${avgROI.toFixed(2)}%\n`;
  pdfContent += `Total Investment Analyzed: $${totalInvestment.toLocaleString()}\n`;
  pdfContent += `Period: ${new Date(history[0]?.timestamp).toLocaleDateString()} to ${new Date(history[history.length - 1]?.timestamp).toLocaleDateString()}\n\n`;

  downloadFile(pdfContent, `lift-metric-history-${Date.now()}.txt`, 'text/plain');
}

// Helper function to download file
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate sample calculation history for demo purposes
export function generateSampleHistory(): CalculationHistoryItem[] {
  const now = Date.now();
  return [
    {
      id: '1',
      timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000),
      projectName: 'E-Commerce Platform Migration',
      inputs: {
        projectName: 'E-Commerce Platform Migration',
        startDate: '2024-01-15',
        projectDuration: 12,
        initialInvestment: 250000,
        annualRevenue: 500000,
        operatingCosts: 150000,
        discountRate: 8
      },
      results: {
        roi: { percentage: 45.5, amount: 113750 },
        timeline: []
      },
      notes: 'High priority - Q1 2024 initiative'
    },
    {
      id: '2',
      timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000),
      projectName: 'CRM System Upgrade',
      inputs: {
        projectName: 'CRM System Upgrade',
        startDate: '2024-02-01',
        projectDuration: 8,
        initialInvestment: 120000,
        annualRevenue: 280000,
        operatingCosts: 80000,
        discountRate: 10
      },
      results: {
        roi: { percentage: 66.7, amount: 80000 },
        timeline: []
      },
      notes: 'Sales team efficiency project'
    },
    {
      id: '3',
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000),
      projectName: 'Data Analytics Platform',
      inputs: {
        projectName: 'Data Analytics Platform',
        startDate: '2024-03-01',
        projectDuration: 18,
        initialInvestment: 450000,
        annualRevenue: 750000,
        operatingCosts: 200000,
        discountRate: 12
      },
      results: {
        roi: { percentage: 22.2, amount: 100000 },
        timeline: []
      },
      notes: 'Strategic data initiative'
    }
  ];
}
