import { CalculationResults } from "../types/calculator";

export interface ExportData {
  calculation: CalculationResults;
  timestamp: string;
  projectName?: string;
}

export async function exportToPDF(data: ExportData | ExportData[]): Promise<Blob> {
  const dataArray = Array.isArray(data) ? data : [data];
  const firstData = dataArray[0];
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1e40af; }
        .metric { margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; }
        .label { font-weight: bold; color: #374151; }
        .value { font-size: 24px; color: #1e40af; margin-top: 5px; }
      </style>
    </head>
    <body>
      <h1>Lift Metric Calculation Report</h1>
      <p>Generated: ${firstData.timestamp}</p>
      ${firstData.projectName ? `<p>Project: ${firstData.projectName}</p>` : ''}
      
      <div class="metric">
        <div class="label">Total Revenue</div>
        <div class="value">$${firstData.calculation.totalRevenue.toLocaleString()}</div>
      </div>
      
      <div class="metric">
        <div class="label">Total Costs</div>
        <div class="value">$${firstData.calculation.totalCosts.toLocaleString()}</div>
      </div>
      
      <div class="metric">
        <div class="label">Net Profit</div>
        <div class="value">$${firstData.calculation.netProfit.toLocaleString()}</div>
      </div>
      
      <div class="metric">
        <div class="label">ROI</div>
        <div class="value">${firstData.calculation.roi.percentage.toFixed(2)}%</div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lift-metric-report.html';
  a.click();
  URL.revokeObjectURL(url);
  
  return blob;
}

export async function exportToCSV(data: ExportData | ExportData[]): Promise<Blob> {
  const dataArray = Array.isArray(data) ? data : [data];
  const firstData = dataArray[0];
  
  const rows = [
    ['Metric', 'Value'],
    ['Generated', firstData.timestamp],
    ['Project Name', firstData.projectName || 'N/A'],
    ['Total Revenue', firstData.calculation.totalRevenue.toString()],
    ['Total Costs', firstData.calculation.totalCosts.toString()],
    ['Net Profit', firstData.calculation.netProfit.toString()],
    ['ROI Percentage', firstData.calculation.roi.percentage.toString()],
    ['ROI Amount', firstData.calculation.roi.amount.toString()],
  ];

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lift-metric-export.csv';
  a.click();
  URL.revokeObjectURL(url);
  
  return blob;
}

export async function exportToPNG(data: ExportData | ExportData[]): Promise<Blob> {
  const dataArray = Array.isArray(data) ? data : [data];
  const firstData = dataArray[0];
  
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Lift Metric Report', 40, 60);

  const metrics = [
    { label: 'Total Revenue', value: `$${firstData.calculation.totalRevenue.toLocaleString()}` },
    { label: 'Total Costs', value: `$${firstData.calculation.totalCosts.toLocaleString()}` },
    { label: 'Net Profit', value: `$${firstData.calculation.netProfit.toLocaleString()}` },
    { label: 'ROI', value: `${firstData.calculation.roi.percentage.toFixed(2)}%` },
  ];

  let yPos = 120;
  metrics.forEach(metric => {
    ctx.fillStyle = '#374151';
    ctx.font = '16px Arial';
    ctx.fillText(metric.label, 40, yPos);
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(metric.value, 40, yPos + 30);
    yPos += 80;
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lift-metric-chart.png';
        a.click();
        URL.revokeObjectURL(url);
        resolve(blob);
      }
    }, 'image/png');
  });
}
