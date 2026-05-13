import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  HelpCircle,
  Upload,
  Zap,
  Download,
  Save,
  BarChart3,
  ArrowRight,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import DataImport from './DataImport';
// @ts-ignore - DataImport default export
import ReportGenerator from './ReportGenerator';
import { ExecutiveReport } from './ExecutiveReport';

const ROICalculator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);
  
  // Input fields
  const [initialInvestment, setInitialInvestment] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [additionalCosts, setAdditionalCosts] = useState('');
  
  // Results
  const [roiPercentage, setRoiPercentage] = useState<number | null>(null);
  const [netProfit, setNetProfit] = useState<number | null>(null);
  const [annualizedROI, setAnnualizedROI] = useState<number | null>(null);
  const [breakEvenMonths, setBreakEvenMonths] = useState<number | null>(null);

  const handleDataImported = (data: any) => {
    if (data.investment || data.initialInvestment) {
      setInitialInvestment(String(data.investment || data.initialInvestment));
    }
    if (data.return || data.revenue || data.returnAmount) {
      setReturnAmount(String(data.return || data.revenue || data.returnAmount));
    }
    if (data.period || data.months || data.timePeriod) {
      setTimePeriod(String(data.period || data.months || data.timePeriod));
    }
    if (data.costs || data.expenses || data.additionalCosts) {
      setAdditionalCosts(String(data.costs || data.expenses || data.additionalCosts));
    }
    
    toast.success('Data imported successfully');
    setShowImport(false);
    setStep(2);
  };

  const calculateROI = () => {
    const investment = parseFloat(initialInvestment) || 0;
    const returns = parseFloat(returnAmount) || 0;
    const costs = parseFloat(additionalCosts) || 0;
    const period = parseFloat(timePeriod) || 1;

    if (investment <= 0) {
      toast.error('Initial investment must be greater than zero');
      return;
    }

    const totalCost = investment + costs;
    const profit = returns - totalCost;
    const roi = (profit / totalCost) * 100;
    const annualized = ((1 + roi / 100) ** (12 / period) - 1) * 100;
    const breakEven = totalCost / (returns / period);

    setNetProfit(profit);
    setRoiPercentage(roi);
    setAnnualizedROI(annualized);
    setBreakEvenMonths(breakEven);
    setStep(3);

    toast.success('ROI calculated successfully');
  };

  const resetCalculator = () => {
    setInitialInvestment('');
    setReturnAmount('');
    setTimePeriod('');
    setAdditionalCosts('');
    setRoiPercentage(null);
    setNetProfit(null);
    setAnnualizedROI(null);
    setBreakEvenMonths(null);
    setStep(1);
  };

  const saveCalculation = () => {
    const calculation = {
      initialInvestment,
      returnAmount,
      timePeriod,
      additionalCosts,
      results: {
        roiPercentage,
        netProfit,
        annualizedROI,
        breakEvenMonths
      },
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for demo purposes
    const saved = JSON.parse(localStorage.getItem('roiCalculations') || '[]');
    saved.unshift(calculation);
    localStorage.setItem('roiCalculations', JSON.stringify(saved.slice(0, 10)));
    
    toast.success('Calculation saved successfully');
  };

  const exportResults = () => {
    const data = {
      'Initial Investment': `$${parseFloat(initialInvestment).toLocaleString()}`,
      'Return Amount': `$${parseFloat(returnAmount).toLocaleString()}`,
      'Time Period (months)': timePeriod,
      'Additional Costs': `$${parseFloat(additionalCosts || '0').toLocaleString()}`,
      'Net Profit': `$${netProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      'ROI Percentage': `${roiPercentage?.toFixed(2)}%`,
      'Annualized ROI': `${annualizedROI?.toFixed(2)}%`,
      'Break-Even (months)': breakEvenMonths?.toFixed(1)
    };

    const csv = Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-calculation-${Date.now()}.csv`;
    a.click();
    
    toast.success('Results exported successfully');
  };

  const TooltipLabel: React.FC<{ 
    label: string; 
    tooltip: string;
  }> = ({ label, tooltip }) => (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const StepIndicator: React.FC = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
            s === step 
              ? 'bg-blue-600 text-white shadow-lg scale-110' 
              : s < step 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {s}
          </div>
          {s < 3 && (
            <div className={`h-1 w-12 rounded transition-all ${
              s < step ? 'bg-green-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ROI Calculator
        </h1>
        <p className="text-muted-foreground text-lg">
          Calculate your return on investment in three simple steps
        </p>
      </div>

      <StepIndicator />

      {/* Step 1: Data Source */}
      {step === 1 && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Choose Your Data Source</h2>
            <p className="text-muted-foreground">How would you like to input your data?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Manual Entry */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-blue-500"
              onClick={() => setStep(2)}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Manual Entry</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your investment data manually using our intuitive form
                </p>
                <Button className="w-full mt-2">
                  Start Entering Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Import Data */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-purple-500"
              onClick={() => setShowImport(!showImport)}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Import Data</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file or connect via API to import your data
                </p>
                <Button variant="outline" className="w-full mt-2">
                  <Zap className="mr-2 h-4 w-4" />
                  Import from File/API
                </Button>
              </div>
            </Card>
          </div>

          {showImport && (
            <div className="mt-8">
              <DataImport
                onDataImported={handleDataImported}
                acceptedFields={['investment', 'initialInvestment', 'return', 'revenue', 'returnAmount', 'period', 'months', 'timePeriod', 'costs', 'expenses', 'additionalCosts']}
              />
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Input Data */}
      {step === 2 && (
        <Card className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Enter Your Investment Data</h2>
            <p className="text-muted-foreground">Fill in the fields below to calculate your ROI</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {/* Initial Investment */}
            <div className="space-y-2">
              <TooltipLabel 
                label="Initial Investment" 
                tooltip="The total amount of money you invested upfront, including all setup costs"
              />
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="10,000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Return Amount */}
            <div className="space-y-2">
              <TooltipLabel 
                label="Total Return Amount" 
                tooltip="The total revenue or gains generated from your investment"
              />
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="15,000"
                  value={returnAmount}
                  onChange={(e) => setReturnAmount(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-2">
              <TooltipLabel 
                label="Time Period (Months)" 
                tooltip="How many months did it take to generate this return?"
              />
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="12"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>

            {/* Additional Costs (Optional) */}
            <div className="space-y-2">
              <TooltipLabel 
                label="Additional Costs (Optional)" 
                tooltip="Any ongoing costs, maintenance fees, or operational expenses"
              />
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="1,000"
                  value={additionalCosts}
                  onChange={(e) => setAdditionalCosts(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={calculateROI}
              size="lg"
              className="px-8"
              disabled={!initialInvestment || !returnAmount || !timePeriod}
            >
              Calculate ROI
              <Calculator className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 3 && roiPercentage !== null && (
        <div className="space-y-6">
          {/* Main ROI Result */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Your Return on Investment</p>
              <h2 className={`text-6xl font-bold mb-4 ${roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roiPercentage >= 0 ? '+' : ''}{roiPercentage.toFixed(2)}%
              </h2>
              <p className="text-lg text-muted-foreground">
                {roiPercentage >= 0 ? 'Positive return!' : 'Negative return'}
              </p>
            </div>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                  <p className={`text-2xl font-bold truncate ${netProfit && netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total profit after costs
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Annualized ROI</p>
                  <p className={`text-2xl font-bold truncate ${annualizedROI && annualizedROI >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {annualizedROI?.toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projected yearly return
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Break-Even Point</p>
                  <p className="text-2xl font-bold text-purple-600 truncate">
                    {breakEvenMonths?.toFixed(1)} months
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time to recover investment
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Input Summary */}
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Calculation Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-muted-foreground">Initial Investment:</span>
                <span className="font-semibold">${parseFloat(initialInvestment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-muted-foreground">Return Amount:</span>
                <span className="font-semibold">${parseFloat(returnAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-muted-foreground">Time Period:</span>
                <span className="font-semibold">{timePeriod} months</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-muted-foreground">Additional Costs:</span>
                <span className="font-semibold">${parseFloat(additionalCosts || '0').toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" onClick={resetCalculator}>
              New Calculation
            </Button>
            <Button variant="outline" onClick={saveCalculation}>
              <Save className="mr-2 h-4 w-4" />
              Save Calculation
            </Button>
            <Button 
              onClick={() => setShowReportGenerator(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              onClick={() => setShowExecutiveReport(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Executive Summary
            </Button>
            <Button variant="outline" onClick={exportResults}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {/* Report Generator Modal */}
      {showReportGenerator && roiPercentage !== null && (
        <ReportGenerator
          isOpen={showReportGenerator}
          onClose={() => setShowReportGenerator(false)}
          roiData={{
            initialInvestment: parseFloat(initialInvestment),
            totalReturn: parseFloat(returnAmount),
            timePeriod: parseFloat(timePeriod),
            additionalCosts: parseFloat(additionalCosts || '0'),
            roi: roiPercentage,
            netProfit: netProfit || 0,
            annualizedROI: annualizedROI || 0,
            breakEvenMonths: breakEvenMonths || 0,
          }}
          isPremium={false}
        />
      )}

      {/* Executive Report Modal */}
      {showExecutiveReport && roiPercentage !== null && (
        <ExecutiveReport
          results={{
            projectName: 'ROI Analysis',
            totalInvestment: parseFloat(initialInvestment) + parseFloat(additionalCosts || '0'),
            annualBenefit: parseFloat(returnAmount) / (parseFloat(timePeriod) / 12),
            netBenefit: netProfit || 0,
            roi: roiPercentage,
            paybackPeriod: (breakEvenMonths || 12) / 12,
            npv: netProfit || 0,
            irr: annualizedROI || 0,
          }}
          onClose={() => setShowExecutiveReport(false)}
        />
      )}
    </div>
  );
};

export default ROICalculator;
