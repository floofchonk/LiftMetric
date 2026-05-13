import { ProjectInputs, Currency, RiskProfile, TShirtSize, StrategicPriority } from '../../types/staffing-calculator';
import { Building2, Calendar, TrendingUp, Target, DollarSign, AlertTriangle } from 'lucide-react';

interface ProjectInputsFormProps {
  projectInputs: ProjectInputs;
  onChange: (inputs: ProjectInputs) => void;
  onNext: () => void;
}

export default function ProjectInputsForm({ projectInputs, onChange, onNext }: ProjectInputsFormProps) {
  const handleChange = (field: keyof ProjectInputs, value: any) => {
    onChange({ ...projectInputs, [field]: value });
  };

  const isValid = projectInputs.projectName && projectInputs.businessUnit && projectInputs.targetGoLiveDate;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h2>
      <p className="text-gray-600 mb-8">Enter the core information about your project</p>

      <div className="space-y-6">
        {/* Project Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectInputs.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="e.g., Customer Portal Redesign"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectInputs.businessUnit}
              onChange={(e) => handleChange('businessUnit', e.target.value)}
              placeholder="e.g., Digital Experience"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={projectInputs.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of the project objectives and scope"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Currency & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              Currency
            </label>
            <select
              value={projectInputs.currency}
              onChange={(e) => handleChange('currency', e.target.value as Currency)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </label>
            <input
              type="date"
              value={projectInputs.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4" />
              Target Go-Live <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={projectInputs.targetGoLiveDate}
              onChange={(e) => handleChange('targetGoLiveDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Risk & Sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Profile
            </label>
            <select
              value={projectInputs.riskProfile}
              onChange={(e) => handleChange('riskProfile', e.target.value as RiskProfile)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4" />
              T-Shirt Size
            </label>
            <select
              value={projectInputs.tShirtSize}
              onChange={(e) => handleChange('tShirtSize', e.target.value as TShirtSize)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="S">Small (S) - Simple project</option>
              <option value="M">Medium (M) - Standard project</option>
              <option value="L">Large (L) - Complex project</option>
              <option value="XL">Extra Large (XL) - Enterprise project</option>
            </select>
          </div>
        </div>

        {/* Complexity Factor & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complexity Factor
              <span className="ml-2 text-xs text-gray-500">(0.5 - 2.0)</span>
            </label>
            <input
              type="number"
              min="0.5"
              max="2.0"
              step="0.1"
              value={projectInputs.complexityFactor}
              onChange={(e) => handleChange('complexityFactor', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Multiplier for effort adjustment (1.0 = baseline)</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              Strategic Priority
            </label>
            <select
              value={projectInputs.strategicPriority}
              onChange={(e) => handleChange('strategicPriority', e.target.value as StrategicPriority)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Rate (%)
              <span className="ml-2 text-xs text-gray-500">for ROI</span>
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={projectInputs.discountRate}
              onChange={(e) => handleChange('discountRate', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-blue-600 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">What's Next?</h4>
              <p className="text-sm text-blue-700">
                After entering project details, you will customize T-shirt size mappings, define roles and effort
                allocation, configure locations with cost indexes, and set up cost models for each staffing approach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to T-Shirt Sizing
        </button>
      </div>
    </div>
  );
}
