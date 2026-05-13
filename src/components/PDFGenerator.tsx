import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type BrandSettings = {
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

type CalculationData = {
  type: string;
  expression?: string;
  result: string;
  timestamp: string;
  details?: Record<string, any>;
};

export async function generateExecutiveSummaryPDF(
  calculation: CalculationData,
  brandSettings?: BrandSettings
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Brand colors (use custom or defaults)
  const primaryColor = brandSettings?.primaryColor || "#3B82F6";
  const secondaryColor = brandSettings?.secondaryColor || "#8B5CF6";
  const primaryRGB = hexToRGB(primaryColor);
  const secondaryRGB = hexToRGB(secondaryColor);

  // Header background
  doc.setFillColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Company logo (if provided)
  if (brandSettings?.logoUrl) {
    try {
      // Note: In production, you'd load and embed the actual image
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Logo", 15, 15);
    } catch (e) {
      // Logo loading failed, continue without it
    }
  }

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE SUMMARY", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const companyName = brandSettings?.companyName || "Lift Metric";
  doc.text(companyName, pageWidth / 2, 30, { align: "center" });

  // Reset text color for body
  doc.setTextColor(0, 0, 0);

  // Date and document info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${date}`, 15, 50);
  doc.text(`Document Type: ${calculation.type} Analysis`, 15, 56);

  // Calculation Overview Section
  doc.setFontSize(16);
  doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
  doc.setFont("helvetica", "bold");
  doc.text("Calculation Overview", 15, 70);

  // Divider line
  doc.setDrawColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
  doc.setLineWidth(0.5);
  doc.line(15, 72, pageWidth - 15, 72);

  // Results box
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(15, 78, pageWidth - 30, 30, 3, 3, "F");
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("Calculation Type:", 20, 88);
  doc.setFont("helvetica", "bold");
  doc.text(calculation.type, 70, 88);

  doc.setFont("helvetica", "normal");
  doc.text("Result:", 20, 98);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
  doc.text(calculation.result, 70, 98);

  // Details Section
  let yPosition = 120;
  
  if (calculation.expression) {
    doc.setFontSize(16);
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.setFont("helvetica", "bold");
    doc.text("Expression", 15, yPosition);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(calculation.expression, 20, yPosition);
    yPosition += 15;
  }

  // Additional details table
  if (calculation.details && Object.keys(calculation.details).length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Breakdown", 15, yPosition);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
    
    yPosition += 10;

    const tableData = Object.entries(calculation.details).map(([key, value]) => [
      key.replace(/([A-Z])/g, " $1").trim(),
      String(value),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [primaryRGB.r, primaryRGB.g, primaryRGB.b],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { left: 15, right: 15 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Key Insights Section
  doc.setFontSize(16);
  doc.setTextColor(primaryRGB.r, primaryRGB.g, primaryRGB.b);
  doc.setFont("helvetica", "bold");
  doc.text("Key Insights", 15, yPosition);
  doc.setLineWidth(0.5);
  doc.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);
  
  yPosition += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  const insights = [
    `• This ${calculation.type.toLowerCase()} calculation was performed on ${new Date(calculation.timestamp).toLocaleString()}`,
    `• Result: ${calculation.result}`,
    "• All calculations use industry-standard formulas and methodologies",
    "• For questions or support, contact support@liftmetric.com",
  ];

  insights.forEach((insight) => {
    doc.text(insight, 20, yPosition);
    yPosition += 7;
  });

  // Footer
  doc.setFillColor(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
  doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(
    `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Save the PDF
  const filename = `${companyName.replace(/\s+/g, "_")}_Executive_Summary_${Date.now()}.pdf`;
  doc.save(filename);
}

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 }; // Default blue
}
