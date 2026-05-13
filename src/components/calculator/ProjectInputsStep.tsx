import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { ProjectInputs } from '../../types/calculator';

interface ProjectInputsStepProps {
  inputs: ProjectInputs;
  onChange: (inputs: ProjectInputs) => void;
}

export function ProjectInputsStep({ inputs, onChange }: ProjectInputsStepProps) {
  const updateField = (field: keyof ProjectInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Project Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            type="text"
            value={inputs.projectName}
            onChange={(e) => updateField('projectName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="e.g., Customer Portal Redesign"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Unit
          </label>
          <input
            type="text"
            value={inputs.businessUnit}
            onChange={(e) => updateField('businessUnit', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="e.g., Marketing, IT, Operations"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={inputs.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Brief description of the project goals and objectives"
        />
      </div>

      {/* Currency and Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={inputs.currency}
            onChange={(e) => updateField('currency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="USD">🇺🇸 USD - US Dollar</option>
            <option value="EUR">🇪🇺 EUR - Euro</option>
            <option value="GBP">🇬🇧 GBP - British Pound</option>
            <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
            <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
            <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
            <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
            <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
            <option value="INR">🇮🇳 INR - Indian Rupee</option>
            <option value="SGD">🇸🇬 SGD - Singapore Dollar</option>
            <option value="HKD">🇭🇰 HKD - Hong Kong Dollar</option>
            <option value="NZD">🇳🇿 NZD - New Zealand Dollar</option>
            <option value="SEK">🇸🇪 SEK - Swedish Krona</option>
            <option value="NOK">🇳🇴 NOK - Norwegian Krone</option>
            <option value="DKK">🇩🇰 DKK - Danish Krone</option>
            <option value="MXN">🇲🇽 MXN - Mexican Peso</option>
            <option value="BRL">🇧🇷 BRL - Brazilian Real</option>
            <option value="ZAR">🇿🇦 ZAR - South African Rand</option>
            <option value="KRW">🇰🇷 KRW - South Korean Won</option>
            <option value="THB">🇹🇭 THB - Thai Baht</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={inputs.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Go-Live
          </label>
          <input
            type="date"
            value={inputs.targetGoLive}
            onChange={(e) => updateField('targetGoLive', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>
      </div>

      {/* Project Size and Risk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Project Size *
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Project Size Guide:</p>
                <p className="mb-1"><strong>Small:</strong> 1-3 months, 2-5 people</p>
                <p className="mb-1"><strong>Medium:</strong> 3-6 months, 5-10 people</p>
                <p className="mb-1"><strong>Large:</strong> 6-12 months, 10-20 people</p>
                <p><strong>Extra Large:</strong> 12+ months, 20+ people</p>
              </div>
            </div>
          </label>
          <select
            value={inputs.tshirtSize}
            onChange={(e) => updateField('tshirtSize', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="S">Small (1-3 months)</option>
            <option value="M">Medium (3-6 months)</option>
            <option value="L">Large (6-12 months)</option>
            <option value="XL">Extra Large (12+ months)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Risk Profile
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Risk Assessment:</p>
                <p className="mb-1"><strong>Low:</strong> Well-defined, stable requirements</p>
                <p className="mb-1"><strong>Medium:</strong> Some uncertainty, manageable complexity</p>
                <p><strong>High:</strong> Uncertain scope, complex dependencies</p>
              </div>
            </div>
          </label>
          <select
            value={inputs.riskProfile}
            onChange={(e) => updateField('riskProfile', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Strategic Priority
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Business Priority:</p>
                <p className="mb-1"><strong>Low:</strong> Nice to have, flexible timing</p>
                <p className="mb-1"><strong>Medium:</strong> Important for business goals</p>
                <p className="mb-1"><strong>High:</strong> Key business objective</p>
                <p><strong>Critical:</strong> Mission-critical, urgent</p>
              </div>
            </div>
          </label>
          <select
            value={inputs.strategicPriority}
            onChange={(e) => updateField('strategicPriority', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>
        </div>
      </div>

      {/* Financial Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Complexity Factor (0.5 - 2.0)
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Complexity Multiplier:</p>
                <p className="mb-1"><strong>0.5-0.8:</strong> Simple, straightforward project</p>
                <p className="mb-1"><strong>0.9-1.1:</strong> Average complexity (default: 1.0)</p>
                <p className="mb-1"><strong>1.2-1.5:</strong> Above average complexity</p>
                <p><strong>1.6-2.0:</strong> Highly complex, many dependencies</p>
              </div>
            </div>
          </label>
          <input
            type="number"
            min="0.5"
            max="2.0"
            step="0.1"
            value={inputs.complexityFactor}
            onChange={(e) => updateField('complexityFactor', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          />
          <p className="mt-1 text-xs text-gray-500">Adjusts effort estimates based on project complexity</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            Discount Rate (%)
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Financial Discount Rate:</p>
                <p className="mb-1">The rate used to calculate the present value of future cash flows (NPV calculation).</p>
                <p className="mb-1"><strong>Typical range:</strong> 5-15%</p>
                <p>Higher rates mean future benefits are worth less today.</p>
              </div>
            </div>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={inputs.discountRate}
            onChange={(e) => updateField('discountRate', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          />
          <p className="mt-1 text-xs text-gray-500">Used for NPV (Net Present Value) calculations</p>
        </div>
      </div>
    </div>
  );
}
