import React, { useState, useRef } from 'react';
import { useBranding } from '../hooks/useBranding';

interface CalculationData {
  id?: string;
  name: string;
  description?: string;
  inputs: {
    initialInvestment: number;
    annualBenefit: number;
    projectDuration: number;
    discountRate: number;
    operatingCosts?: number;
  };
  results: {
    roi: number;
    npv: number;
    paybackPeriod: number;
    irr?: number;
  };
  createdAt?: string;
  tags?: string[];
  notes?: string;
}

interface PresentationViewProps {
  calculation: CalculationData;
  onClose: () => void;
}

export function PresentationView({ calculation, onClose }: PresentationViewProps) {
  const { getColorPalette } = useBranding();
  const brandColors = {
    primary: getColorPalette().primary,
    secondary: getColorPalette().secondary,
  };
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [presenterName, setPresenterName] = useState('');
  const [presenterTitle, setPresenterTitle] = useState('');
  const [audienceName, setAudienceName] = useState('Leadership Team');
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);

  const { inputs, results } = calculation;
  const netBenefit = (inputs.annualBenefit * inputs.projectDuration) - inputs.initialInvestment - ((inputs.operatingCosts || 0) * inputs.projectDuration);

  // Risk analysis based on metrics
  const getRiskLevel = () => {
    if (results.roi > 100 && results.paybackPeriod < 2 && results.npv > inputs.initialInvestment) {
      return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    } else if (results.roi > 50 && results.paybackPeriod < 3 && results.npv > 0) {
      return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    } else {
      return { level: 'Elevated', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
  };

  const risk = getRiskLevel();

  // Generate shareable link
  const generateShareableLink = () => {
    const linkId = Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/presentation/${linkId}`;
    
    // Store presentation data in localStorage for retrieval
    const presentationData = {
      calculation,
      companyLogo,
      presenterName,
      presenterTitle,
      audienceName,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    localStorage.setItem(`presentation_${linkId}`, JSON.stringify(presentationData));
    
    setShareableLink(link);
    setShowShareModal(true);
  };

  const copyLinkToClipboard = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Risk mitigation strategies based on calculation
  const getRiskMitigations = () => {
    const mitigations = [];
    
    if (results.paybackPeriod > 2) {
      mitigations.push({
        risk: 'Extended Payback Period',
        strategy: 'Consider phased implementation to realize benefits earlier',
        impact: 'High'
      });
    }
    
    if (results.roi < 100) {
      mitigations.push({
        risk: 'Below-Target ROI',
        strategy: 'Explore cost optimization or benefit enhancement opportunities',
        impact: 'Medium'
      });
    }
    
    if (inputs.operatingCosts && inputs.operatingCosts > inputs.annualBenefit * 0.3) {
      mitigations.push({
        risk: 'High Operating Costs',
        strategy: 'Negotiate vendor contracts or automate operational processes',
        impact: 'Medium'
      });
    }

    if (mitigations.length === 0) {
      mitigations.push({
        risk: 'Market Volatility',
        strategy: 'Maintain 10% contingency reserve for market fluctuations',
        impact: 'Low'
      });
    }

    return mitigations;
  };

  const mitigations = getRiskMitigations();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Control Bar - Hidden in print */}
      <div className="print:hidden sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit Presentation
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              📊 Executive Presentation Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Logo Upload */}
            <label className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
              {companyLogo ? '🖼️ Change Logo' : '📷 Add Logo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>

            {/* Generate Link */}
            <button
              onClick={generateShareableLink}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
              style={{ backgroundColor: brandColors.primary }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Generate Shareable Link
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Content */}
      <div ref={presentationRef} className="max-w-5xl mx-auto my-8 print:my-0">
        {/* Cover Page */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none mb-8 print:mb-0 print:page-break-after-always">
          {/* Header with gradient */}
          <div 
            className="px-12 py-16 text-center"
            style={{ 
              background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)` 
            }}
          >
            {/* Company Logo */}
            <div className="mb-8">
              {companyLogo ? (
                <img src={companyLogo} alt="Company Logo" className="h-20 mx-auto object-contain" />
              ) : (
                <div className="h-20 w-48 mx-auto bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-sm">Company Logo</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Investment Analysis
            </h1>
            <h2 className="text-2xl text-white/90 mb-2">
              {calculation.name}
            </h2>
            {calculation.description && (
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {calculation.description}
              </p>
            )}
          </div>

          {/* Presenter Info */}
          <div className="px-12 py-8 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 print:hidden">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Prepared By
                </label>
                <input
                  type="text"
                  value={presenterName}
                  onChange={(e) => setPresenterName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={presenterTitle}
                  onChange={(e) => setPresenterTitle(e.target.value)}
                  placeholder="Your Title"
                  className="w-full px-3 py-2 mt-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Prepared For
                </label>
                <input
                  type="text"
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
                  placeholder="Leadership Team"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Print-only presenter info */}
          <div className="hidden print:block px-12 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                {presenterName && <span>Prepared by: <strong>{presenterName}</strong></span>}
                {presenterTitle && <span className="ml-2">({presenterTitle})</span>}
              </div>
              <div>Prepared for: <strong>{audienceName}</strong></div>
              <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* The Bottom Line Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none mb-8 print:page-break-after-always">
          <div className="px-12 py-10">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: brandColors.primary }}
              >
                💰
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  The Bottom Line
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Executive Summary</p>
              </div>
            </div>

            {/* Key Verdict Card */}
            <div 
              className="rounded-2xl p-8 mb-8"
              style={{ 
                background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.secondary}15 100%)`,
                borderLeft: `6px solid ${brandColors.primary}`
              }}
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">
                  {results.roi >= 100 ? '✅' : results.roi >= 50 ? '⚠️' : '❌'}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {results.roi >= 100 
                      ? 'Strong Investment Opportunity' 
                      : results.roi >= 50 
                        ? 'Moderate Investment Potential'
                        : 'Requires Further Analysis'}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    This {inputs.projectDuration}-year investment of <strong>{formatCurrency(inputs.initialInvestment)}</strong> is 
                    projected to generate a <strong>{formatPercent(results.roi)} return on investment</strong>, 
                    with a net present value of <strong>{formatCurrency(results.npv)}</strong>. 
                    The investment will pay for itself in approximately <strong>{results.paybackPeriod.toFixed(1)} years</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                  Return on Investment
                </div>
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatPercent(results.roi)}
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  {results.roi >= 100 ? '↑ Exceeds target' : results.roi >= 50 ? '→ Meets target' : '↓ Below target'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Net Present Value
                </div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(results.npv)}
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  {results.npv > 0 ? '↑ Positive value' : '↓ Negative value'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                  Payback Period
                </div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {results.paybackPeriod.toFixed(1)} yrs
                </div>
                <div className="text-xs text-purple-500 mt-1">
                  {results.paybackPeriod < 2 ? '↑ Quick recovery' : results.paybackPeriod < 3 ? '→ Moderate' : '↓ Extended'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
                  Net Benefit
                </div>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {formatCurrency(netBenefit)}
                </div>
                <div className="text-xs text-amber-500 mt-1">
                  Over {inputs.projectDuration} years
                </div>
              </div>
            </div>

            {/* Investment Summary Table */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Metric</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Value</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Initial Investment</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(inputs.initialInvestment)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300">
                        Baseline
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Annual Benefit</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">{formatCurrency(inputs.annualBenefit)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        Revenue Stream
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">Total Return ({inputs.projectDuration} years)</td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(inputs.annualBenefit * inputs.projectDuration)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        Cumulative
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 dark:bg-emerald-900/20">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Net Benefit</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-lg">{formatCurrency(netBenefit)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                        ✓ Profit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Risk Mitigation Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none mb-8">
          <div className="px-12 py-10">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: brandColors.secondary }}
              >
                🛡️
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Risk Mitigation
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Strategic risk assessment and countermeasures</p>
              </div>
            </div>

            {/* Overall Risk Level */}
            <div className={`rounded-2xl p-6 mb-8 ${risk.bg} ${risk.border} border-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {risk.level === 'Low' ? '🟢' : risk.level === 'Moderate' ? '🟡' : '🔴'}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${risk.color}`}>
                      Overall Risk Level: {risk.level}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on ROI, NPV, and payback period analysis
                    </p>
                  </div>
                </div>
                <div className={`px-6 py-3 rounded-xl ${risk.color} font-bold text-lg`}>
                  {risk.level === 'Low' ? 'RECOMMENDED' : risk.level === 'Moderate' ? 'PROCEED WITH CAUTION' : 'REVIEW REQUIRED'}
                </div>
              </div>
            </div>

            {/* Risk Matrix Visual */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Risk Factors Analysis
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Financial Risk</span>
                      <span className={results.npv > 0 ? 'text-green-600' : 'text-red-600'}>
                        {results.npv > 0 ? 'Low' : 'High'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${results.npv > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.max(20, 100 - (results.npv > 0 ? 30 : 80)))}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Time-to-Value Risk</span>
                      <span className={results.paybackPeriod < 2 ? 'text-green-600' : results.paybackPeriod < 3 ? 'text-yellow-600' : 'text-red-600'}>
                        {results.paybackPeriod < 2 ? 'Low' : results.paybackPeriod < 3 ? 'Moderate' : 'High'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${results.paybackPeriod < 2 ? 'bg-green-500' : results.paybackPeriod < 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, results.paybackPeriod * 25)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Return Risk</span>
                      <span className={results.roi > 100 ? 'text-green-600' : results.roi > 50 ? 'text-yellow-600' : 'text-red-600'}>
                        {results.roi > 100 ? 'Low' : results.roi > 50 ? 'Moderate' : 'High'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${results.roi > 100 ? 'bg-green-500' : results.roi > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.max(20, 100 - results.roi / 2))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sensitivity Indicators
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Break-even threshold</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPercent((inputs.initialInvestment / (inputs.annualBenefit * inputs.projectDuration)) * 100)} of projected benefits
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Safety margin</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatPercent(((inputs.annualBenefit * inputs.projectDuration - inputs.initialInvestment) / inputs.initialInvestment) * 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">Discount rate used</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPercent(inputs.discountRate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mitigation Strategies */}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Mitigation Strategies
            </h4>
            <div className="space-y-4">
              {mitigations.map((item, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      item.impact === 'High' ? 'bg-red-500' : item.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 dark:text-white">{item.risk}</h5>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.impact === 'High' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : item.impact === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {item.impact} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        <strong>Strategy:</strong> {item.strategy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation & Call to Action */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none mb-8">
          <div 
            className="px-12 py-10"
            style={{ 
              background: `linear-gradient(135deg, ${brandColors.primary}08 0%, ${brandColors.secondary}08 100%)` 
            }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-5xl mb-6">
                {results.roi >= 100 ? '🚀' : results.roi >= 50 ? '📊' : '🔍'}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recommendation
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {results.roi >= 100 
                  ? `Based on the analysis, we recommend proceeding with this investment. The projected ${formatPercent(results.roi)} ROI and ${results.paybackPeriod.toFixed(1)}-year payback period demonstrate strong financial viability with manageable risk.`
                  : results.roi >= 50
                    ? `This investment shows moderate potential with a ${formatPercent(results.roi)} projected ROI. We recommend further analysis of cost optimization opportunities before final approval.`
                    : `The current projections indicate below-target returns. We recommend exploring alternative approaches or conducting additional due diligence before proceeding.`
                }
              </p>

              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: brandColors.primary }}>
                    {formatCurrency(netBenefit)}
                  </div>
                  <div className="text-sm text-gray-500">Projected Net Benefit</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-slate-600" />
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: brandColors.secondary }}>
                    {formatPercent(results.roi)}
                  </div>
                  <div className="text-sm text-gray-500">Return on Investment</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-slate-600" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {results.paybackPeriod.toFixed(1)} yrs
                  </div>
                  <div className="text-sm text-gray-500">Payback Period</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-12 py-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Generated by Lift Metric • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div>
                {calculation.tags && calculation.tags.length > 0 && (
                  <span>Tags: {calculation.tags.join(', ')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${brandColors.primary}20` }}>
                <svg className="w-8 h-8" style={{ color: brandColors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Shareable Link Generated
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Share this link with stakeholders to view the presentation
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={shareableLink || ''}
                  readOnly
                  className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm font-mono truncate"
                />
                <button
                  onClick={copyLinkToClipboard}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                  style={{ backgroundColor: linkCopied ? '#10B981' : brandColors.primary }}
                >
                  {linkCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-amber-500">⚠️</span>
                <div className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Note:</strong> This link will expire in 7 days. Anyone with the link can view this presentation in read-only mode.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (shareableLink) {
                    window.open(`mailto:?subject=Investment Analysis: ${calculation.name}&body=Please review this investment analysis: ${shareableLink}`, '_blank');
                  }
                }}
                className="flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all"
                style={{ backgroundColor: brandColors.primary }}
              >
                Send via Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:my-0 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          .print\\:mb-0 {
            margin-bottom: 0 !important;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}

export default PresentationView;
