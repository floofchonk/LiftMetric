import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Calculator, Save } from 'lucide-react';
import { calculateROI } from '../lib/calculator-engine';
import type {
  ProjectInputs,
  TShirtSize,
  Role,
  Location,
  CostModels,
} from '../types/calculator';

interface StaffingCalculatorProps {
  onSave?: (data: any) => void;
}

const defaultProjectInputs: ProjectInputs = {
  projectName: '',
  description: '',
  businessUnit: '',
  currency: 'USD',
  startDate: '',
  targetGoLive: '',
  riskProfile: 'medium',
  tshirtSize: 'M',
  complexityFactor: 1.0,
  strategicPriority: 'medium',
  discountRate: 10,
};

const defaultTShirtSizes: TShirtSize[] = [
  {
    size: 'S',
    baseHours: 500,
    baseDurationMonths: 2,
    phases: { discovery: 15, design: 20, build: 40, testing: 15, launch: 5, hypercare: 5 },
  },
  {
    size: 'M',
    baseHours: 2000,
    baseDurationMonths: 4,
    phases: { discovery: 10, design: 15, build: 50, testing: 15, launch: 5, hypercare: 5 },
  },
  {
    size: 'L',
    baseHours: 5000,
    baseDurationMonths: 8,
    phases: { discovery: 10, design: 15, build: 55, testing: 12, launch: 4, hypercare: 4 },
  },
  {
    size: 'XL',
    baseHours: 10000,
    baseDurationMonths: 12,
    phases: { discovery: 8, design: 12, build: 60, testing: 12, launch: 4, hypercare: 4 },
  },
];

const defaultRoles: Role[] = [
  { id: '1', name: 'Product Manager', category: 'Product', seniority: 'senior', allocationPercentage: 50 },
  { id: '2', name: 'Tech Lead', category: 'Development', seniority: 'lead', allocationPercentage: 100 },
  { id: '3', name: 'Senior Developer', category: 'Development', seniority: 'senior', allocationPercentage: 100 },
  { id: '4', name: 'QA Engineer', category: 'QA', seniority: 'mid', allocationPercentage: 75 },
];

const defaultLocations: Location[] = [
  { id: '1', name: 'HQ', city: 'San Francisco', region: 'North America', costMultiplier: 1.3 },
];

const defaultCostModels: CostModels = {
  directHire: {},
  contractor: {},
  vendor: {},
};

export default function StaffingCalculator({ onSave }: StaffingCalculatorProps) {
  const [step, setStep] = useState(1);
  const [projectInputs, setProjectInputs] = useState<ProjectInputs>(defaultProjectInputs);
  const [tshirtSizes] = useState<TShirtSize[]>(defaultTShirtSizes);
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [costModels, setCostModels] = useState<CostModels>(defaultCostModels);
  const [results, setResults] = useState<any>(null);

  const steps = [
    { id: 1, name: 'Project Info', description: 'Basic project details' },
    { id: 2, name: 'Team Roles', description: 'Define team structure' },
    { id: 3, name: 'Cost Models', description: 'Configure costs' },
    { id: 4, name: 'Results', description: 'View analysis' },
  ];

  const handleCalculate = () => {
    const selectedSize = tshirtSizes.find(s => s.size === projectInputs.tshirtSize) || tshirtSizes[1];
    const totalCosts = roles.reduce((sum, role) => sum + (role.hours || role.estimatedHours || 0) * (role.hourlyRate || 100), 0) || 50000;
    const totalRevenue = totalCosts * 1.5;
    const projectLifetime = (selectedSize.baseDurationMonths || 6) / 12;
    const calculatedResults = calculateROI(totalRevenue, totalCosts, projectLifetime);
    setResults(calculatedResults);
    setStep(4);
  };

  const handleSave = () => {
    if (onSave && results) {
      onSave({
        projectInputs,
        roles,
        locations,
        costModels,
        results,
        savedAt: new Date().toISOString(),
      });
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else handleCalculate();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Staffing ROI Calculator</h2>
        </div>
        <p className="text-blue-100">
          Analyze staffing options and calculate ROI for your project
        </p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    step >= s.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {s.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${step >= s.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {s.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectInputs.projectName || ''}
                  onChange={(e) => setProjectInputs({ ...projectInputs, projectName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Unit
                </label>
                <input
                  type="text"
                  value={projectInputs.businessUnit || ''}
                  onChange={(e) => setProjectInputs({ ...projectInputs, businessUnit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., Engineering, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Size (T-Shirt)
                </label>
                <select
                  value={projectInputs.tshirtSize || 'M'}
                  onChange={(e) => setProjectInputs({ ...projectInputs, tshirtSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="S">Small (500 hours)</option>
                  <option value="M">Medium (2,000 hours)</option>
                  <option value="L">Large (5,000 hours)</option>
                  <option value="XL">Extra Large (10,000 hours)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Profile
                </label>
                <select
                  value={projectInputs.riskProfile || 'medium'}
                  onChange={(e) => setProjectInputs({ ...projectInputs, riskProfile: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={projectInputs.description || ''}
                  onChange={(e) => setProjectInputs({ ...projectInputs, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  rows={3}
                  placeholder="Brief project description"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Roles</h3>
              <button
                onClick={() => setRoles([...roles, { id: Date.now().toString(), name: '', category: 'Development', seniority: 'mid', allocationPercentage: 100 }])}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Role
              </button>
            </div>
            <div className="space-y-3">
              {roles.map((role, index) => (
                <div key={role.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={role.name || ''}
                      onChange={(e) => {
                        const updated = [...roles];
                        updated[index] = { ...role, name: e.target.value };
                        setRoles(updated);
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-600 dark:text-white"
                      placeholder="Role name"
                    />
                    <select
                      value={role.category || 'Development'}
                      onChange={(e) => {
                        const updated = [...roles];
                        updated[index] = { ...role, category: e.target.value };
                        setRoles(updated);
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-600 dark:text-white"
                    >
                      <option value="Product">Product</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="QA">QA</option>
                      <option value="Operations">Operations</option>
                    </select>
                    <select
                      value={role.seniority || 'mid'}
                      onChange={(e) => {
                        const updated = [...roles];
                        updated[index] = { ...role, seniority: e.target.value };
                        setRoles(updated);
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-600 dark:text-white"
                    >
                      <option value="junior">Junior</option>
                      <option value="mid">Mid</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={role.allocationPercentage || 100}
                        onChange={(e) => {
                          const updated = [...roles];
                          updated[index] = { ...role, allocationPercentage: Number(e.target.value) };
                          setRoles(updated);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-600 dark:text-white"
                        min="0"
                        max="100"
                      />
                      <span className="text-gray-500 dark:text-gray-400">%</span>
                      <button
                        onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Direct Hire</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Avg. Annual Salary</label>
                    <input
                      type="number"
                      value={costModels.directHire.baseSalary || 120000}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        directHire: { ...costModels.directHire, baseSalary: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Benefits %</label>
                    <input
                      type="number"
                      value={costModels.directHire.benefits || 30}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        directHire: { ...costModels.directHire, benefits: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-300 mb-3">Contractor</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Hourly Rate</label>
                    <input
                      type="number"
                      value={costModels.contractor.hourlyRate || 150}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        contractor: { ...costModels.contractor, hourlyRate: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Agency Fee %</label>
                    <input
                      type="number"
                      value={costModels.contractor.agencyFee || 15}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        contractor: { ...costModels.contractor, agencyFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-3">Vendor</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Project Fee</label>
                    <input
                      type="number"
                      value={costModels.vendor.projectFee || 500000}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        vendor: { ...costModels.vendor, projectFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">Management Fee %</label>
                    <input
                      type="number"
                      value={costModels.vendor.managementFee || 20}
                      onChange={(e) => setCostModels({
                        ...costModels,
                        vendor: { ...costModels.vendor, managementFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Results Summary</h3>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Save Analysis
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${(results.totalCosts || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {typeof results.roi === 'object' ? results.roi.percentage?.toFixed(1) : results.roi?.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payback Period</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results.paybackPeriod?.toFixed(1)} months
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendation</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your inputs, we recommend the <strong>{results.bestOption}</strong> approach
                for optimal cost-effectiveness and timeline alignment.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-600 flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {step === 3 ? 'Calculate' : step === 4 ? 'New Analysis' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
