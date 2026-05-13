import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  fontFamily: string;
  fontHeading: string;
  companyName: string;
  tagline: string;
}

interface ReportData {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  metrics?: MetricCard[];
  charts?: ChartData[];
}

interface ReportSection {
  title: string;
  content: string | string[];
  type?: 'text' | 'table' | 'list';
  data?: any[][];
  headers?: string[];
}

interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: number[];
  labels: string[];
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [37, 99, 235];
}

export async function exportBrandedPDF(
  reportData: ReportData,
  branding: BrandingConfig
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  const primaryRgb = hexToRgb(branding.primaryColor);
  const secondaryRgb = hexToRgb(branding.secondaryColor);

  // Header with branding
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Logo
  if (branding.logoUrl) {
    try {
      doc.addImage(branding.logoUrl, 'PNG', 15, 10, 30, 20);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  // Company name and tagline
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(branding.companyName, branding.logoUrl ? 50 : 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(branding.tagline, branding.logoUrl ? 50 : 15, 28);

  // Date
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 15, 20, { align: 'right' });

  yPosition = 50;

  // Report title
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(reportData.title, 15, yPosition);
  yPosition += 10;

  if (reportData.subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(reportData.subtitle, 15, yPosition);
    yPosition += 15;
  } else {
    yPosition += 10;
  }

  // Metrics cards
  if (reportData.metrics && reportData.metrics.length > 0) {
    const cardWidth = (pageWidth - 40) / reportData.metrics.length;
    reportData.metrics.forEach((metric, index) => {
      const x = 15 + index * cardWidth;
      
      doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.setLineWidth(0.5);
      doc.rect(x, yPosition, cardWidth - 5, 25);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(metric.label, x + 3, yPosition + 8);

      doc.setFontSize(16);
      doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(String(metric.value), x + 3, yPosition + 18);

      if (metric.change) {
        doc.setFontSize(8);
        const trendColor = metric.trend === 'up' ? [34, 197, 94] : metric.trend === 'down' ? [239, 68, 68] : [156, 163, 175];
        doc.setTextColor(trendColor[0], trendColor[1], trendColor[2]);
        doc.text(metric.change, x + 3, yPosition + 23);
      }
    });
    yPosition += 35;
  }

  // Sections
  for (const section of reportData.sections) {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
    doc.text(section.title, 15, yPosition);
    yPosition += 8;

    // Section content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    if (section.type === 'table' && section.data && section.headers) {
      autoTable(doc, {
        startY: yPosition,
        head: [section.headers],
        body: section.data,
        theme: 'grid',
        headStyles: {
          fillColor: primaryRgb,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    } else if (section.type === 'list' && Array.isArray(section.content)) {
      section.content.forEach((item) => {
        doc.setFontSize(10);
        doc.text(`• ${item}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    } else {
      const lines = doc.splitTextToSize(String(section.content), pageWidth - 30);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 15, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${branding.companyName} | ${reportData.title}`,
      15,
      pageHeight - 10
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
  }

  // Save the PDF
  const filename = `${reportData.title.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  doc.save(filename);
}

export function exportBrandedCSV(
  data: any[],
  headers: string[],
  filename: string,
  branding: BrandingConfig
): void {
  let csv = `${branding.companyName} - ${filename}\n`;
  csv += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  csv += headers.join(',') + '\n';
  
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header] ?? '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csv += values.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBrandedHTML(
  reportData: ReportData,
  branding: BrandingConfig
): string {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportData.title} - ${branding.companyName}</title>
  <link href="https://fonts.googleapis.com/css2?family=${branding.fontFamily.replace(/\s+/g, '+')}:wght@400;600&family=${branding.fontHeading.replace(/\s+/g, '+')}:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: '${branding.fontFamily}', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background: ${branding.primaryColor};
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1, h2, h3 {
      font-family: '${branding.fontHeading}', sans-serif;
      color: ${branding.primaryColor};
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; color: white; }
    h2 { font-size: 1.8em; margin: 30px 0 15px; color: ${branding.secondaryColor}; }
    h3 { font-size: 1.3em; margin: 20px 0 10px; }
    .tagline { font-size: 1.1em; opacity: 0.9; }
    .date { font-size: 0.9em; opacity: 0.8; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      background: white;
      border-left: 4px solid ${branding.primaryColor};
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .metric-label { color: #666; font-size: 0.9em; margin-bottom: 5px; }
    .metric-value { 
      font-size: 2em; 
      font-weight: bold; 
      color: ${branding.primaryColor};
      font-family: '${branding.fontHeading}', sans-serif;
    }
    .metric-change { font-size: 0.85em; margin-top: 5px; }
    .section {
      background: white;
      padding: 25px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th {
      background: ${branding.primaryColor};
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
    }
    tr:nth-child(even) { background: #f9fafb; }
    ul { margin: 15px 0; padding-left: 25px; }
    li { margin: 8px 0; }
    footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid ${branding.primaryColor};
      color: #666;
      font-size: 0.9em;
    }
    @media print {
      body { max-width: 100%; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName}" style="height: 50px; margin-bottom: 10px;">` : ''}
      <h1>${branding.companyName}</h1>
      <div class="tagline">${branding.tagline}</div>
    </div>
    <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
  </header>

  <div class="section">
    <h2>${reportData.title}</h2>
    ${reportData.subtitle ? `<p style="color: #666; margin-top: 10px;">${reportData.subtitle}</p>` : ''}
  </div>

  ${reportData.metrics ? `
    <div class="metrics">
      ${reportData.metrics.map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value">${m.value}</div>
          ${m.change ? `<div class="metric-change" style="color: ${m.trend === 'up' ? '#22c55e' : m.trend === 'down' ? '#ef4444' : '#9ca3af'}">${m.change}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  ${reportData.sections.map(section => `
    <div class="section">
      <h3>${section.title}</h3>
      ${section.type === 'table' && section.data && section.headers ? `
        <table>
          <thead>
            <tr>${section.headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${section.data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      ` : section.type === 'list' && Array.isArray(section.content) ? `
        <ul>
          ${section.content.map(item => `<li>${item}</li>`).join('')}
        </ul>
      ` : `
        <p>${section.content}</p>
      `}
    </div>
  `).join('')}

  <footer>
    <p>${branding.companyName} | ${reportData.title}</p>
    <p style="margin-top: 5px;">© ${new Date().getFullYear()} All rights reserved</p>
  </footer>
</body>
</html>
  `;

  return html;
}

export function downloadBrandedHTML(reportData: ReportData, branding: BrandingConfig): void {
  const html = exportBrandedHTML(reportData, branding);
  const blob = new Blob([html], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${reportData.title.replace(/\s+/g, '-')}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
