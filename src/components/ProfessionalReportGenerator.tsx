import React, { useState, useRef } from 'react';
import { useBranding } from '../hooks/useBranding';

interface CalculationResults {
  projectName?: string;
  totalInvestment: number;
  annualBenefit: number;
  netBenefit: number;
  roi: number;
  paybackPeriod: number;
  npv?: number;
  irr?: number;
  discountRate?: number;
  projectDuration?: number;
  operatingCosts?: number;
  yearlyProjections?: Array<{
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    cumulativeProfit: number;
  }>;
}

interface ProfessionalReportGeneratorProps {
  results: CalculationResults;
  isOpen: boolean;
  onClose: () => void;
}

interface Assumption {
  id: string;
  category: string;
  description: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
}

interface RiskItem {
  id: string;
  risk: string;
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  mitigation: string;
}

export function ProfessionalReportGenerator({ results, isOpen, onClose }: ProfessionalReportGeneratorProps) {
  const { branding } = useBranding();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'assumptions' | 'projections' | 'risks'>('overview');
  
  // Company branding
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState(branding?.companyName || 'Your Company');
  const [reportTitle, setReportTitle] = useState(results.projectName || 'Investment Analysis Report');
  const [preparedBy, setPreparedBy] = useState('');
  const [preparedFor, setPreparedFor] = useState('');
  
  // Executive summary notes
  const [executiveSummary, setExecutiveSummary] = useState(
    `This report presents a comprehensive analysis of the proposed ${results.projectName || 'investment'} initiative. Based on our financial modeling, the project demonstrates ${results.roi >= 15 ? 'strong' : results.roi >= 5 ? 'moderate' : 'limited'} return potential with key metrics indicating ${results.npv && results.npv > 0 ? 'positive value creation' : 'areas requiring further evaluation'}.`
  );

  // Core assumptions
  const [assumptions, setAssumptions] = useState<Assumption[]>([
    { id: '1', category: 'Financial', description: 'Discount Rate', value: `${results.discountRate || 10}%`, confidence: 'high' },
    { id: '2', category: 'Financial', description: 'Project Duration', value: `${results.projectDuration || 5} years`, confidence: 'high' },
    { id: '3', category: 'Revenue', description: 'Annual Benefit Growth', value: '5% year-over-year', confidence: 'medium' },
    { id: '4', category: 'Costs', description: 'Operating Cost Inflation', value: '2% annually', confidence: 'medium' },
    { id: '5', category: 'Market', description: 'Market Conditions', value: 'Stable with moderate growth', confidence: 'medium' },
    { id: '6', category: 'Implementation', description: 'Timeline Adherence', value: 'On schedule delivery', confidence: 'low' },
  ]);

  // Risk analysis
  const [risks, setRisks] = useState<RiskItem[]>([
    { 
      id: '1', 
      risk: 'Market volatility affecting projected returns', 
      impact: 'high', 
      probability: 'medium',
      mitigation: 'Diversified revenue streams and flexible pricing strategy'
    },
    { 
      id: '2', 
      risk: 'Implementation delays increasing costs', 
      impact: 'medium', 
      probability: 'medium',
      mitigation: 'Phased rollout with milestone-based budgeting'
    },
    { 
      id: '3', 
      risk: 'Technology obsolescence', 
      impact: 'medium', 
      probability: 'low',
      mitigation: 'Modular architecture enabling component upgrades'
    },
    { 
      id: '4', 
      risk: 'Resource availability constraints', 
      impact: 'medium', 
      probability: 'medium',
      mitigation: 'Cross-training and strategic partnerships'
    },
  ]);

  // Recommendations
  const [recommendations, setRecommendations] = useState<string[]>([
    'Proceed with phased implementation to validate assumptions early',
    'Establish quarterly review checkpoints to monitor KPIs',
    'Maintain 15% contingency reserve for unforeseen expenses',
    'Consider accelerating timeline if Year 1 targets are met',
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  // Generate projections
  const projections = results.yearlyProjections || Array.from({ length: results.projectDuration || 5 }, (_, i) => {
    const year = i + 1;
    const revenue = results.annualBenefit * Math.pow(1.05, i);
    const costs = ((results.operatingCosts || results.totalInvestment * 0.1) + (i === 0 ? results.totalInvestment : 0)) * Math.pow(1.02, i);
    const profit = revenue - costs;
    const previousCumulative = i === 0 ? -results.totalInvestment : 0;
    const cumulativeProfit = previousCumulative + profit;
    return { year, revenue, costs, profit, cumulativeProfit };
  });

  // Calculate cumulative properly
  let runningTotal = -results.totalInvestment;
  const projectionsWithCumulative = projections.map((p, i) => {
    runningTotal += p.profit;
    return { ...p, cumulativeProfit: runningTotal };
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAssumption = () => {
    const newAssumption: Assumption = {
      id: Date.now().toString(),
      category: 'Custom',
      description: 'New Assumption',
      value: 'Value',
      confidence: 'medium'
    };
    setAssumptions([...assumptions, newAssumption]);
  };

  const updateAssumption = (id: string, field: keyof Assumption, value: string) => {
    setAssumptions(assumptions.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAssumption = (id: string) => {
    setAssumptions(assumptions.filter(a => a.id !== id));
  };

  const addRisk = () => {
    const newRisk: RiskItem = {
      id: Date.now().toString(),
      risk: 'New Risk',
      impact: 'medium',
      probability: 'medium',
      mitigation: 'Mitigation strategy'
    };
    setRisks([...risks, newRisk]);
  };

  const updateRisk = (id: string, field: keyof RiskItem, value: string) => {
    setRisks(risks.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  // Chart calculations
  const chartWidth = 700;
  const chartHeight = 300;
  const padding = 60;
  const maxValue = Math.max(...projectionsWithCumulative.map(p => Math.max(p.revenue, p.costs, Math.abs(p.cumulativeProfit))));
  const minValue = Math.min(...projectionsWithCumulative.map(p => p.cumulativeProfit), 0);
  const valueRange = maxValue - minValue || 1;

  const getY = (value: number) => {
    return chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);
  };

  const getX = (index: number) => {
    const dataLength = projectionsWithCumulative.length;
    return padding + (index / (dataLength - 1 || 1)) * (chartWidth - 2 * padding);
  };

  const revenuePath = projectionsWithCumulative.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.revenue)}`
  ).join(' ');

  const costsPath = projectionsWithCumulative.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.costs)}`
  ).join(' ');

  const profitPath = projectionsWithCumulative.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.cumulativeProfit)}`
  ).join(' ');

  const handlePrint = () => {
    window.print();
  };

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    return `
================================================================================
                        ${reportTitle.toUpperCase()}
================================================================================
                              EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Prepared by: ${preparedBy || 'Financial Analysis Team'}
Prepared for: ${preparedFor || 'Executive Leadership'}
Date: ${currentDate}
Company: ${companyName}

--------------------------------------------------------------------------------
                              EXECUTIVE OVERVIEW
--------------------------------------------------------------------------------
${executiveSummary}

================================================================================
                           KEY PERFORMANCE METRICS
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│  METRIC                    │  VALUE              │  STATUS                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Return on Investment      │  ${formatPercent(results.roi).padEnd(18)}│  ${(results.roi >= 15 ? 'EXCELLENT' : results.roi >= 5 ? 'GOOD' : 'BELOW TARGET').padEnd(24)}│
│  Net Present Value         │  ${formatCurrency(results.npv || results.netBenefit).padEnd(18)}│  ${((results.npv || results.netBenefit) > 0 ? 'POSITIVE' : 'NEGATIVE').padEnd(24)}│
│  Payback Period            │  ${(results.paybackPeriod.toFixed(1) + ' years').padEnd(18)}│  ${(results.paybackPeriod <= 2 ? 'QUICK' : results.paybackPeriod <= 4 ? 'MODERATE' : 'EXTENDED').padEnd(24)}│
│  Internal Rate of Return   │  ${formatPercent(results.irr || results.roi * 0.8).padEnd(18)}│  ${((results.irr || results.roi * 0.8) >= 12 ? 'STRONG' : 'ACCEPTABLE').padEnd(24)}│
└─────────────────────────────────────────────────────────────────────────────┘

FINANCIAL SUMMARY:
  • Total Investment Required:  ${formatCurrency(results.totalInvestment)}
  • Annual Benefit Expected:    ${formatCurrency(results.annualBenefit)}
  • Net Benefit (${results.projectDuration || 5} Years):      ${formatCurrency(results.netBenefit)}
  • Operating Costs (Annual):   ${formatCurrency(results.operatingCosts || results.totalInvestment * 0.1)}

================================================================================
                              CORE ASSUMPTIONS
================================================================================

${assumptions.map((a, i) => `
${i + 1}. ${a.description}
   Category: ${a.category}
   Value: ${a.value}
   Confidence Level: ${a.confidence.toUpperCase()}
`).join('')}

================================================================================
                           FINANCIAL PROJECTIONS
================================================================================

Year    Revenue         Costs           Profit          Cumulative
--------------------------------------------------------------------------------
${projectionsWithCumulative.map(p => 
  `${p.year.toString().padEnd(8)}${formatCurrency(p.revenue).padEnd(16)}${formatCurrency(p.costs).padEnd(16)}${formatCurrency(p.profit).padEnd(16)}${formatCurrency(p.cumulativeProfit)}`
).join('\n')}
--------------------------------------------------------------------------------

================================================================================
                              RISK ANALYSIS
================================================================================

${risks.map((r, i) => `
RISK ${i + 1}: ${r.risk}
├── Impact: ${r.impact.toUpperCase()}
├── Probability: ${r.probability.toUpperCase()}
├── Risk Score: ${getRiskScore(r.impact, r.probability)}
└── Mitigation: ${r.mitigation}
`).join('')}

RISK MATRIX SUMMARY:
  High Impact/High Probability:   ${risks.filter(r => r.impact === 'high' && r.probability === 'high').length} risks
  High Impact/Medium Probability: ${risks.filter(r => r.impact === 'high' && r.probability === 'medium').length} risks
  Medium Impact Risks:            ${risks.filter(r => r.impact === 'medium').length} risks
  Low Impact Risks:               ${risks.filter(r => r.impact === 'low').length} risks

================================================================================
                            RECOMMENDATIONS
================================================================================

${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

================================================================================
                              CONCLUSION
================================================================================

Based on the analysis presented, this investment ${results.roi >= 10 && (results.npv || results.netBenefit) > 0 
  ? 'is RECOMMENDED for approval with the outlined risk mitigations in place.'
  : 'requires further evaluation before proceeding. Consider the identified risks and assumptions carefully.'}

Key Decision Factors:
${results.roi >= 15 ? '✓' : '○'} ROI exceeds 15% threshold
${(results.npv || results.netBenefit) > 0 ? '✓' : '○'} Positive NPV indicates value creation
${results.paybackPeriod <= 3 ? '✓' : '○'} Payback within 3 years
${risks.filter(r => r.impact === 'high' && r.probability === 'high').length === 0 ? '✓' : '○'} No critical unmitigated risks

--------------------------------------------------------------------------------
                         CONFIDENTIAL - FOR INTERNAL USE ONLY
                              © ${new Date().getFullYear()} ${companyName}
--------------------------------------------------------------------------------
`;
  };

  const getRiskScore = (impact: string, probability: string): string => {
    const scores: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const score = scores[impact] * scores[probability];
    if (score >= 6) return 'CRITICAL';
    if (score >= 4) return 'HIGH';
    if (score >= 2) return 'MODERATE';
    return 'LOW';
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    // Use html2canvas-like approach via SVG
    if (reportRef.current) {
      try {
        // Create a simplified image export
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1600;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Header gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 200);
          gradient.addColorStop(0, branding?.primaryColor || '#3b82f6');
          gradient.addColorStop(1, branding?.secondaryColor || '#8b5cf6');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, 200);
          
          // Title
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(reportTitle, canvas.width / 2, 80);
          
          ctx.font = '18px Arial';
          ctx.fillText(`Prepared for ${preparedFor || 'Executive Leadership'}`, canvas.width / 2, 120);
          ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 150);
          
          // Metrics
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('Key Performance Metrics', 60, 260);
          
          // ROI
          ctx.font = '18px Arial';
          ctx.fillText('Return on Investment:', 60, 310);
          ctx.fillStyle = results.roi >= 15 ? '#10b981' : results.roi >= 5 ? '#f59e0b' : '#ef4444';
          ctx.font = 'bold 24px Arial';
          ctx.fillText(formatPercent(results.roi), 300, 310);
          
          // NPV
          ctx.fillStyle = '#1f2937';
          ctx.font = '18px Arial';
          ctx.fillText('Net Present Value:', 60, 360);
          ctx.fillStyle = (results.npv || results.netBenefit) > 0 ? '#10b981' : '#ef4444';
          ctx.font = 'bold 24px Arial';
          ctx.fillText(formatCurrency(results.npv || results.netBenefit), 300, 360);
          
          // Payback
          ctx.fillStyle = '#1f2937';
          ctx.font = '18px Arial';
          ctx.fillText('Payback Period:', 60, 410);
          ctx.fillStyle = results.paybackPeriod <= 2 ? '#10b981' : results.paybackPeriod <= 4 ? '#f59e0b' : '#ef4444';
          ctx.font = 'bold 24px Arial';
          ctx.fillText(`${results.paybackPeriod.toFixed(1)} years`, 300, 410);
          
          // Financial Summary
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 24px Arial';
          ctx.fillText('Financial Summary', 60, 500);
          
          ctx.font = '16px Arial';
          ctx.fillText(`Total Investment: ${formatCurrency(results.totalInvestment)}`, 60, 540);
          ctx.fillText(`Annual Benefit: ${formatCurrency(results.annualBenefit)}`, 60, 570);
          ctx.fillText(`Net Benefit: ${formatCurrency(results.netBenefit)}`, 60, 600);
          
          // Recommendations section
          ctx.font = 'bold 24px Arial';
          ctx.fillText('Recommendations', 60, 700);
          
          ctx.font = '14px Arial';
          recommendations.slice(0, 4).forEach((rec, i) => {
            ctx.fillText(`${i + 1}. ${rec}`, 60, 740 + i * 30);
          });
          
          // Footer
          ctx.fillStyle = '#6b7280';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`© ${new Date().getFullYear()} ${companyName} - Confidential`, canvas.width / 2, canvas.height - 40);
          
          // Download
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
    setIsExporting(false);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div 
          className="p-6 text-white flex items-center justify-between print:bg-blue-600"
          style={{ 
            background: `linear-gradient(135deg, ${branding?.primaryColor || '#3b82f6'}, ${branding?.secondaryColor || '#8b5cf6'})` 
          }}
        >
          <div className="flex items-center gap-4">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="h-12 w-auto bg-white/20 rounded-lg p-1" />
            ) : (
              <label className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <span className="text-2xl">📷</span>
              </label>
            )}
            <div>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="bg-transparent text-2xl font-bold border-b border-white/30 focus:border-white outline-none w-full"
              />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-transparent text-sm opacity-80 border-b border-white/20 focus:border-white outline-none mt-1"
                placeholder="Company Name"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors print:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Prepared By/For */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700 flex gap-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Prepared by:</span>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="Your name"
              className="text-sm bg-white dark:bg-slate-700 border dark:border-slate-600 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Prepared for:</span>
            <input
              type="text"
              value={preparedFor}
              onChange={(e) => setPreparedFor(e.target.value)}
              placeholder="Recipient name"
              className="text-sm bg-white dark:bg-slate-700 border dark:border-slate-600 rounded px-2 py-1"
            />
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 bg-gray-100 dark:bg-slate-800 border-b dark:border-slate-700 flex gap-2 print:hidden">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'assumptions', label: '📋 Assumptions', icon: '📋' },
            { id: 'projections', label: '📈 Projections', icon: '📈' },
            { id: 'risks', label: '⚠️ Risk Analysis', icon: '⚠️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeSection === tab.id
                  ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={reportRef} className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 border border-blue-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span> Executive Summary
                </h2>
                <textarea
                  value={executiveSummary}
                  onChange={(e) => setExecutiveSummary(e.target.value)}
                  className="w-full bg-white/80 dark:bg-slate-700/80 rounded-lg p-4 border-0 resize-none h-24 text-gray-700 dark:text-gray-200"
                  placeholder="Write your executive summary..."
                />
              </div>

              {/* Key Metrics */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Key Performance Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    label="Return on Investment"
                    value={formatPercent(results.roi)}
                    status={results.roi >= 15 ? 'excellent' : results.roi >= 5 ? 'good' : 'below'}
                    statusLabel={results.roi >= 15 ? 'Excellent' : results.roi >= 5 ? 'Good' : 'Below Target'}
                    icon="📈"
                  />
                  <MetricCard
                    label="Net Present Value"
                    value={formatCurrency(results.npv || results.netBenefit)}
                    status={(results.npv || results.netBenefit) > 0 ? 'excellent' : 'below'}
                    statusLabel={(results.npv || results.netBenefit) > 0 ? 'Value Creation' : 'Value Loss'}
                    icon="💰"
                  />
                  <MetricCard
                    label="Payback Period"
                    value={`${results.paybackPeriod.toFixed(1)} yrs`}
                    status={results.paybackPeriod <= 2 ? 'excellent' : results.paybackPeriod <= 4 ? 'good' : 'below'}
                    statusLabel={results.paybackPeriod <= 2 ? 'Quick' : results.paybackPeriod <= 4 ? 'Moderate' : 'Extended'}
                    icon="⏱️"
                  />
                  <MetricCard
                    label="Internal Rate of Return"
                    value={formatPercent(results.irr || results.roi * 0.8)}
                    status={(results.irr || results.roi * 0.8) >= 12 ? 'excellent' : 'good'}
                    statusLabel={(results.irr || results.roi * 0.8) >= 12 ? 'Strong' : 'Acceptable'}
                    icon="📊"
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Investment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Total Investment</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(results.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Annual Benefit</span>
                      <span className="font-bold text-green-600">{formatCurrency(results.annualBenefit)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Operating Costs (Annual)</span>
                      <span className="font-bold text-red-500">{formatCurrency(results.operatingCosts || results.totalInvestment * 0.1)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-blue-50 dark:bg-blue-900/20 -mx-6 px-6 rounded-lg">
                      <span className="text-gray-900 dark:text-white font-medium">Net Benefit ({results.projectDuration || 5} Years)</span>
                      <span className="font-bold text-xl text-blue-600 dark:text-blue-400">{formatCurrency(results.netBenefit)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 border border-amber-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>💡</span> Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 group">
                        <span className="text-amber-500 font-bold">{i + 1}.</span>
                        <input
                          type="text"
                          value={rec}
                          onChange={(e) => {
                            const newRecs = [...recommendations];
                            newRecs[i] = e.target.value;
                            setRecommendations(newRecs);
                          }}
                          className="flex-1 bg-transparent border-b border-transparent hover:border-amber-300 focus:border-amber-500 outline-none text-gray-700 dark:text-gray-200"
                        />
                        <button
                          onClick={() => setRecommendations(recommendations.filter((_, idx) => idx !== i))}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity print:hidden"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setRecommendations([...recommendations, 'New recommendation'])}
                    className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium print:hidden"
                  >
                    + Add Recommendation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assumptions Section */}
          {activeSection === 'assumptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📋</span> Core Assumptions
                </h2>
                <button
                  onClick={addAssumption}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium print:hidden"
                >
                  + Add Assumption
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Assumptions form the foundation of this analysis. Review confidence levels carefully - lower confidence items may require additional validation.
              </div>

              <div className="grid gap-4">
                {assumptions.map((assumption) => (
                  <div
                    key={assumption.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</label>
                          <select
                            value={assumption.category}
                            onChange={(e) => updateAssumption(assumption.id, 'category', e.target.value)}
                            className="mt-1 w-full bg-gray-50 dark:bg-slate-700 border dark:border-slate-600 rounded px-3 py-2 text-sm"
                          >
                            <option>Financial</option>
                            <option>Revenue</option>
                            <option>Costs</option>
                            <option>Market</option>
                            <option>Implementation</option>
                            <option>Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</label>
                          <input
                            type="text"
                            value={assumption.description}
                            onChange={(e) => updateAssumption(assumption.id, 'description', e.target.value)}
                            className="mt-1 w-full bg-gray-50 dark:bg-slate-700 border dark:border-slate-600 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Value</label>
                          <input
                            type="text"
                            value={assumption.value}
                            onChange={(e) => updateAssumption(assumption.id, 'value', e.target.value)}
                            className="mt-1 w-full bg-gray-50 dark:bg-slate-700 border dark:border-slate-600 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Confidence</label>
                          <select
                            value={assumption.confidence}
                            onChange={(e) => updateAssumption(assumption.id, 'confidence', e.target.value)}
                            className={`mt-1 w-full rounded px-3 py-2 text-sm font-medium ${getConfidenceColor(assumption.confidence)}`}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAssumption(assumption.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all print:hidden"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confidence Summary */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confidence Level Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{assumptions.filter(a => a.confidence === 'high').length}</div>
                    <div className="text-sm text-green-700 dark:text-green-400">High Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{assumptions.filter(a => a.confidence === 'medium').length}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-400">Medium Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{assumptions.filter(a => a.confidence === 'low').length}</div>
                    <div className="text-sm text-red-700 dark:text-red-400">Low Confidence</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projections Section */}
          {activeSection === 'projections' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">📈</span> Financial Projections
              </h2>

              {/* Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700 overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{results.projectDuration || 5}-Year Financial Forecast</h3>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-4xl mx-auto">
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padding + ratio * (chartHeight - 2 * padding);
                    const value = maxValue - ratio * valueRange;
                    return (
                      <g key={ratio}>
                        <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={padding - 10} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">{formatCurrency(value)}</text>
                      </g>
                    );
                  })}

                  {/* Zero line */}
                  <line 
                    x1={padding} 
                    y1={getY(0)} 
                    x2={chartWidth - padding} 
                    y2={getY(0)} 
                    stroke="#6b7280" 
                    strokeWidth="2" 
                    strokeDasharray="4,4" 
                  />

                  {/* Data lines */}
                  <path d={revenuePath} fill="none" stroke="#10b981" strokeWidth="3" />
                  <path d={costsPath} fill="none" stroke="#ef4444" strokeWidth="3" />
                  <path d={profitPath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8,4" />

                  {/* Data points */}
                  {projectionsWithCumulative.map((p, i) => (
                    <g key={i}>
                      <circle cx={getX(i)} cy={getY(p.revenue)} r="6" fill="#10b981" />
                      <circle cx={getX(i)} cy={getY(p.costs)} r="6" fill="#ef4444" />
                      <circle cx={getX(i)} cy={getY(p.cumulativeProfit)} r="6" fill="#3b82f6" />
                      <text x={getX(i)} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-gray-600">Year {p.year}</text>
                    </g>
                  ))}

                  {/* Legend */}
                  <g transform={`translate(${padding}, 20)`}>
                    <circle cx="0" cy="0" r="5" fill="#10b981" />
                    <text x="12" y="4" className="text-xs fill-gray-700">Revenue</text>
                    <circle cx="80" cy="0" r="5" fill="#ef4444" />
                    <text x="92" y="4" className="text-xs fill-gray-700">Costs</text>
                    <circle cx="140" cy="0" r="5" fill="#3b82f6" />
                    <text x="152" y="4" className="text-xs fill-gray-700">Cumulative Profit</text>
                  </g>
                </svg>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Costs</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Annual Profit</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-700">
                    {projectionsWithCumulative.map((p) => (
                      <tr key={p.year} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Year {p.year}</td>
                        <td className="px-6 py-4 text-right text-green-600 font-medium">{formatCurrency(p.revenue)}</td>
                        <td className="px-6 py-4 text-right text-red-500 font-medium">{formatCurrency(p.costs)}</td>
                        <td className={`px-6 py-4 text-right font-medium ${p.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {formatCurrency(p.profit)}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${p.cumulativeProfit >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                          {formatCurrency(p.cumulativeProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-blue-50 dark:bg-blue-900/20">
                    <tr>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Total</td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {formatCurrency(projectionsWithCumulative.reduce((sum, p) => sum + p.revenue, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-500">
                        {formatCurrency(projectionsWithCumulative.reduce((sum, p) => sum + p.costs, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                        {formatCurrency(projectionsWithCumulative.reduce((sum, p) => sum + p.profit, 0))}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">
                        {formatCurrency(projectionsWithCumulative[projectionsWithCumulative.length - 1]?.cumulativeProfit || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Risk Analysis Section */}
          {activeSection === 'risks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> Risk Analysis
                </h2>
                <button
                  onClick={addRisk}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium print:hidden"
                >
                  + Add Risk
                </button>
              </div>

              {/* Risk Matrix */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Risk Matrix</h3>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div></div>
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2">Low Prob.</div>
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2">Med Prob.</div>
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2">High Prob.</div>
                  
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2 text-right pr-2">High Impact</div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-3 text-yellow-800 dark:text-yellow-300 font-bold">
                    {risks.filter(r => r.impact === 'high' && r.probability === 'low').length}
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-3 text-orange-800 dark:text-orange-300 font-bold">
                    {risks.filter(r => r.impact === 'high' && r.probability === 'medium').length}
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 rounded p-3 text-red-800 dark:text-red-300 font-bold">
                    {risks.filter(r => r.impact === 'high' && r.probability === 'high').length}
                  </div>
                  
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2 text-right pr-2">Med Impact</div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded p-3 text-green-800 dark:text-green-300 font-bold">
                    {risks.filter(r => r.impact === 'medium' && r.probability === 'low').length}
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-3 text-yellow-800 dark:text-yellow-300 font-bold">
                    {risks.filter(r => r.impact === 'medium' && r.probability === 'medium').length}
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-3 text-orange-800 dark:text-orange-300 font-bold">
                    {risks.filter(r => r.impact === 'medium' && r.probability === 'high').length}
                  </div>
                  
                  <div className="font-medium text-gray-600 dark:text-gray-400 py-2 text-right pr-2">Low Impact</div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded p-3 text-green-800 dark:text-green-300 font-bold">
                    {risks.filter(r => r.impact === 'low' && r.probability === 'low').length}
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded p-3 text-green-800 dark:text-green-300 font-bold">
                    {risks.filter(r => r.impact === 'low' && r.probability === 'medium').length}
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-3 text-yellow-800 dark:text-yellow-300 font-bold">
                    {risks.filter(r => r.impact === 'low' && r.probability === 'high').length}
                  </div>
                </div>
              </div>

              {/* Risk Items */}
              <div className="grid gap-4">
                {risks.map((risk, index) => (
                  <div
                    key={risk.id}
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <input
                            type="text"
                            value={risk.risk}
                            onChange={(e) => updateRisk(risk.id, 'risk', e.target.value)}
                            className="flex-1 font-medium text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Impact</label>
                            <select
                              value={risk.impact}
                              onChange={(e) => updateRisk(risk.id, 'impact', e.target.value)}
                              className={`mt-1 w-full rounded px-3 py-2 text-sm font-medium ${getImpactColor(risk.impact)}`}
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Probability</label>
                            <select
                              value={risk.probability}
                              onChange={(e) => updateRisk(risk.id, 'probability', e.target.value)}
                              className={`mt-1 w-full rounded px-3 py-2 text-sm font-medium ${getImpactColor(risk.probability)}`}
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Risk Score</label>
                            <div className={`mt-1 px-3 py-2 rounded text-sm font-bold text-center ${
                              getRiskScore(risk.impact, risk.probability) === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              getRiskScore(risk.impact, risk.probability) === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                              getRiskScore(risk.impact, risk.probability) === 'MODERATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {getRiskScore(risk.impact, risk.probability)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mitigation Strategy</label>
                          <textarea
                            value={risk.mitigation}
                            onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                            className="mt-1 w-full bg-gray-50 dark:bg-slate-700 border dark:border-slate-600 rounded px-3 py-2 text-sm resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeRisk(risk.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all print:hidden"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-between print:hidden">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {companyName} • Confidential
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <span>🖨️</span> Print
            </button>
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <span>🖼️</span> Export Image
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <span>📄</span> {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ label, value, status, statusLabel, icon }: {
  label: string;
  value: string;
  status: 'excellent' | 'good' | 'below';
  statusLabel: string;
  icon: string;
}) {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    good: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    below: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  };

  const valueColors = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-yellow-600 dark:text-yellow-400',
    below: 'text-red-600 dark:text-red-400',
  };

  const badgeColors = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    good: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    below: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  };

  return (
    <div className={`rounded-xl p-5 border-2 ${statusColors[status]} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColors[status]}`}>
          {statusLabel}
        </span>
      </div>
      <div className={`text-3xl font-bold ${valueColors[status]} mb-1`}>{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

export default ProfessionalReportGenerator;
