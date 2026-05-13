import { useState } from 'react';
import { useInteractionTracking } from '../hooks/usePerformanceTracking';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator } from 'lucide-react';
import { CalculatorInputs } from '../App';
import DynamicInputSection, { DynamicLineItem } from './DynamicInputSection';

interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
}

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const { trackInteraction } = useInteractionTracking();
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [annualVolume, setAnnualVolume] = useState('');
  const [currentSpend, setCurrentSpend] = useState('');
  const [timelineMonths, setTimelineMonths] = useState('12');
  const [customCosts, setCustomCosts] = useState<DynamicLineItem[]>([]);
  const [customBenefits, setCustomBenefits] = useState<DynamicLineItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endTracking = trackInteraction('calculate_roi');
    
    if (!companySize || !industry || !projectScope || !annualVolume || !currentSpend) {
      alert('Please fill in all fields');
      return;
    }

    onCalculate({
      companySize,
      industry,
      projectScope,
      annualVolume,
      currentSpend,
      timelineMonths: parseInt(timelineMonths),
      customCosts,
      customBenefits,
    });
    endTracking();
  };

  const isFormValid = companySize && industry && projectScope && annualVolume && currentSpend;

  // Cost handlers
  const handleAddCost = () => {
    const newCost: DynamicLineItem = {
      id: `cost-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: '',
      value: 0,
      description: '',
    };
    setCustomCosts([...customCosts, newCost]);
  };

  const handleRemoveCost = (id: string) => {
    setCustomCosts(customCosts.filter(cost => cost.id !== id));
  };

  const handleCostChange = (id: string, field: 'label' | 'value' | 'description', value: string | number) => {
    setCustomCosts(customCosts.map(cost => 
      cost.id === id ? { ...cost, [field]: value } : cost
    ));
  };

  // Benefit handlers
  const handleAddBenefit = () => {
    const newBenefit: DynamicLineItem = {
      id: `benefit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: '',
      value: 0,
      description: '',
    };
    setCustomBenefits([...customBenefits, newBenefit]);
  };

  const handleRemoveBenefit = (id: string) => {
    setCustomBenefits(customBenefits.filter(benefit => benefit.id !== id));
  };

  const handleBenefitChange = (id: string, field: 'label' | 'value' | 'description', value: string | number) => {
    setCustomBenefits(customBenefits.map(benefit => 
      benefit.id === id ? { ...benefit, [field]: value } : benefit
    ));
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto shadow-xl border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">Calculate Your Implementation ROI</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Answer a few questions to get personalized staffing recommendations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-base font-semibold text-gray-900">
                Company Size
              </Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="companySize" className="h-12">
                  <SelectValue placeholder="Select your company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-150">50-150 employees (Startup)</SelectItem>
                  <SelectItem value="151-300">151-300 employees (Growth Stage)</SelectItem>
                  <SelectItem value="301-500">301-500 employees (Mid-Market)</SelectItem>
                  <SelectItem value="500+">500+ employees (Enterprise)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                This helps us estimate baseline costs and team structure
              </p>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-base font-semibold text-gray-900">
                Primary Industry
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" className="h-12">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology / Software</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="professional">Professional Services</SelectItem>
                  <SelectItem value="retail">Retail / E-commerce</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Industry affects typical cost structures and benchmarks
              </p>
            </div>

            {/* Project Scope */}
            <div className="space-y-2">
              <Label htmlFor="projectScope" className="text-base font-semibold text-gray-900">
                Implementation Scope
              </Label>
              <Select value={projectScope} onValueChange={setProjectScope}>
                <SelectTrigger id="projectScope" className="h-12">
                  <SelectValue placeholder="Select implementation scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-product">Single Product / Service</SelectItem>
                  <SelectItem value="multi-product">Multiple Products</SelectItem>
                  <SelectItem value="platform">Full Platform Implementation</SelectItem>
                  <SelectItem value="transformation">Digital Transformation</SelectItem>
                  <SelectItem value="ongoing">Ongoing Operations</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Complexity of what you are implementing or managing
              </p>
            </div>

            {/* Annual Volume */}
            <div className="space-y-2">
              <Label htmlFor="annualVolume" className="text-base font-semibold text-gray-900">
                Annual Project Volume
              </Label>
              <Select value={annualVolume} onValueChange={setAnnualVolume}>
                <SelectTrigger id="annualVolume" className="h-12">
                  <SelectValue placeholder="Select annual volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 projects/initiatives per year</SelectItem>
                  <SelectItem value="6-15">6-15 projects/initiatives per year</SelectItem>
                  <SelectItem value="16-30">16-30 projects/initiatives per year</SelectItem>
                  <SelectItem value="31-50">31-50 projects/initiatives per year</SelectItem>
                  <SelectItem value="50+">50+ projects/initiatives per year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Higher volume indicates need for dedicated team capacity
              </p>
            </div>

            {/* Current Annual Spend */}
            <div className="space-y-2">
              <Label htmlFor="currentSpend" className="text-base font-semibold text-gray-900">
                Current Annual Spend (Optional)
              </Label>
              <Select value={currentSpend} onValueChange={setCurrentSpend}>
                <SelectTrigger id="currentSpend" className="h-12">
                  <SelectValue placeholder="Select your current spend" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">I do not know</SelectItem>
                  <SelectItem value="0-250k">Under $250,000</SelectItem>
                  <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="1m-2.5m">$1,000,000 - $2,500,000</SelectItem>
                  <SelectItem value="2.5m-5m">$2,500,000 - $5,000,000</SelectItem>
                  <SelectItem value="5m+">Over $5,000,000</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                If unknown, we will estimate based on your company size and volume
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-base font-semibold text-gray-900">
                Planning Timeline
              </Label>
              <Select value={timelineMonths} onValueChange={setTimelineMonths}>
                <SelectTrigger id="timeline" className="h-12">
                  <SelectValue placeholder="Select planning horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 months (1 year)</SelectItem>
                  <SelectItem value="24">24 months (2 years)</SelectItem>
                  <SelectItem value="36">36 months (3 years)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Longer timelines show more accurate total cost of ownership
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={!isFormValid}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate ROI & Compare Options
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Dynamic Cost Inputs */}
      <div className="max-w-5xl mx-auto">
        <DynamicInputSection
          title="Additional Costs"
          items={customCosts}
          onAdd={handleAddCost}
          onRemove={handleRemoveCost}
          onChange={handleCostChange}
          type="cost"
        />
      </div>

      {/* Dynamic Benefit Inputs */}
      <div className="max-w-5xl mx-auto">
        <DynamicInputSection
          title="Additional Benefits"
          items={customBenefits}
          onAdd={handleAddBenefit}
          onRemove={handleRemoveBenefit}
          onChange={handleBenefitChange}
          type="benefit"
        />
      </div>

      {/* Submit button at bottom if custom items exist */}
      {(customCosts.length > 0 || customBenefits.length > 0) && (
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            disabled={!isFormValid}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calculate ROI with Custom Items
          </Button>
        </div>
      )}
    </div>
  );
}
