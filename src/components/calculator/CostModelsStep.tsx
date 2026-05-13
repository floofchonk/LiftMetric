import { useState } from 'react';
import { DollarSign, Users, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import type { 
  Role,
  Location,
  DirectHireCosts,
  ContractorCosts,
  VendorCosts
} from '../../types/calculator';

interface DirectHireConfig {
  assignments: DirectHireAssignment[];
}

interface DirectHireAssignment {
  roleId: string;
  locationId: string;
  baseSalary: number;
  benefitsPercent: number;
  taxesPercent: number;
  overheadPercent: number;
  fixedCosts: number;
}

interface ContractorConfig {
  assignments: ContractorAssignment[];
}

interface ContractorAssignment {
  roleId: string;
  locationId: string;
  billRate: number;
  markupPercent: number;
  managementPercent: number;
}

interface VendorConfig {
  rateType: 'T&M' | 'Fixed' | 'Milestone';
  baseRate: number;
  fixedFee?: number;
  milestonePayments?: Array<{ name: string; amount: number; dueDate: string }>;
  discountPercent: number;
  slaBufferPercent: number;
  oversightHours: number;
  internalOversightHours?: number;
  oversightRate?: number;
}

interface CostModelsStepProps {
  roles: Role[];
  locations: Location[];
  directHire: DirectHireConfig;
  contractor: ContractorConfig;
  vendor: VendorConfig;
  onUpdateDirectHire: (config: DirectHireConfig) => void;
  onUpdateContractor: (config: ContractorConfig) => void;
  onUpdateVendor: (config: VendorConfig) => void;
}

export default function CostModelsStep({
  roles,
  locations,
  directHire,
  contractor,
  vendor,
  onUpdateDirectHire,
  onUpdateContractor,
  onUpdateVendor
}: CostModelsStepProps) {
  const [activeModel, setActiveModel] = useState<'directHire' | 'contractor' | 'vendor'>('directHire');

  const addDirectHireAssignment = () => {
    const newAssignment = {
      roleId: roles[0]?.name || '',
      locationId: locations[0]?.id || '',
      baseSalary: 100000,
      benefitsPercent: 25,
      taxesPercent: 15,
      overheadPercent: 20,
      fixedCosts: 5000
    };
    onUpdateDirectHire({
      ...directHire,
      assignments: [...directHire.assignments, newAssignment]
    });
  };

  const updateDirectHireAssignment = (index: number, field: string, value: any) => {
    const updated = [...directHire.assignments];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateDirectHire({ ...directHire, assignments: updated });
  };

  const removeDirectHireAssignment = (index: number) => {
    onUpdateDirectHire({
      ...directHire,
      assignments: directHire.assignments.filter((_, i) => i !== index)
    });
  };

  const addContractorAssignment = () => {
    const newAssignment = {
      roleId: roles[0]?.name || '',
      locationId: locations[0]?.id || '',
      billRate: 150,
      markupPercent: 20,
      managementPercent: 10
    };
    onUpdateContractor({
      ...contractor,
      assignments: [...contractor.assignments, newAssignment]
    });
  };

  const updateContractorAssignment = (index: number, field: string, value: any) => {
    const updated = [...contractor.assignments];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateContractor({ ...contractor, assignments: updated });
  };

  const removeContractorAssignment = (index: number) => {
    onUpdateContractor({
      ...contractor,
      assignments: contractor.assignments.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Cost Models Configuration</h3>
        <p className="text-gray-600 mt-2">Configure cost parameters for each staffing model</p>
      </div>

      {/* Model Selector */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveModel('directHire')}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
            activeModel === 'directHire'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="inline-block w-5 h-5 mr-2" />
          Direct Hire
        </button>
        <button
          onClick={() => setActiveModel('contractor')}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
            activeModel === 'contractor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="inline-block w-5 h-5 mr-2" />
          Onsite Contractor
        </button>
        <button
          onClick={() => setActiveModel('vendor')}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
            activeModel === 'vendor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="inline-block w-5 h-5 mr-2" />
          Outsourced Vendor
        </button>
      </div>

      {/* Direct Hire Model */}
      {activeModel === 'directHire' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Direct Hire Model</h4>
            <p className="text-sm text-blue-800">
              Full-time employees with salary, benefits, taxes, and overhead costs.
              Formula: Fully Loaded Cost = Salary × (1 + Benefits% + Taxes% + Overhead%) × Cost Index
            </p>
          </div>

          {directHire.assignments.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No direct hire assignments yet</p>
            </div>
          )}

          {directHire.assignments.map((assignment, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-gray-900">Assignment {index + 1}</h5>
                <button
                  onClick={() => removeDirectHireAssignment(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={assignment.roleId}
                    onChange={(e) => updateDirectHireAssignment(index, 'roleId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role.name} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={assignment.locationId}
                    onChange={(e) => updateDirectHireAssignment(index, 'locationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city}, {loc.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary ($)</label>
                  <input
                    type="number"
                    value={assignment.baseSalary}
                    onChange={(e) => updateDirectHireAssignment(index, 'baseSalary', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (%)</label>
                  <input
                    type="number"
                    value={assignment.benefitsPercent}
                    onChange={(e) => updateDirectHireAssignment(index, 'benefitsPercent', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taxes (%)</label>
                  <input
                    type="number"
                    value={assignment.taxesPercent}
                    onChange={(e) => updateDirectHireAssignment(index, 'taxesPercent', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overhead (%)</label>
                  <input
                    type="number"
                    value={assignment.overheadPercent}
                    onChange={(e) => updateDirectHireAssignment(index, 'overheadPercent', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Costs ($)</label>
                  <input
                    type="number"
                    value={assignment.fixedCosts}
                    onChange={(e) => updateDirectHireAssignment(index, 'fixedCosts', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addDirectHireAssignment}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-medium"
          >
            + Add Direct Hire Assignment
          </button>
        </div>
      )}

      {/* Contractor Model */}
      {activeModel === 'contractor' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Onsite Contractor Model</h4>
            <p className="text-sm text-green-800">
              Contract workers with hourly bill rates, markup, and management overhead.
              Formula: Effective Rate = Bill Rate × (1 + Markup% + Management%)
            </p>
          </div>

          {contractor.assignments.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No contractor assignments yet</p>
            </div>
          )}

          {contractor.assignments.map((assignment, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-gray-900">Assignment {index + 1}</h5>
                <button
                  onClick={() => removeContractorAssignment(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={assignment.roleId}
                    onChange={(e) => updateContractorAssignment(index, 'roleId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role.name} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={assignment.locationId}
                    onChange={(e) => updateContractorAssignment(index, 'locationId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city}, {loc.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Rate ($/hr)</label>
                  <input
                    type="number"
                    value={assignment.billRate}
                    onChange={(e) => updateContractorAssignment(index, 'billRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                  <input
                    type="number"
                    value={assignment.markupPercent}
                    onChange={(e) => updateContractorAssignment(index, 'markupPercent', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Management (%)</label>
                  <input
                    type="number"
                    value={assignment.managementPercent}
                    onChange={(e) => updateContractorAssignment(index, 'managementPercent', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addContractorAssignment}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-all duration-200 font-medium"
          >
            + Add Contractor Assignment
          </button>
        </div>
      )}

      {/* Vendor Model */}
      {activeModel === 'vendor' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Outsourced Vendor Model</h4>
            <p className="text-sm text-purple-800">
              External vendor pricing with rate type, discounts, SLA buffer, and internal oversight costs.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Type</label>
                <select
                  value={vendor.rateType}
                  onChange={(e) => onUpdateVendor({ ...vendor, rateType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="T&M">Time & Materials</option>
                  <option value="Fixed">Fixed Price</option>
                  <option value="Milestone">Milestone-Based</option>
                </select>
              </div>

              {vendor.rateType === 'T&M' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate ($)</label>
                  <input
                    type="number"
                    value={vendor.baseRate || 0}
                    onChange={(e) => onUpdateVendor({ ...vendor, baseRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {vendor.rateType === 'Fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Fee ($)</label>
                  <input
                    type="number"
                    value={vendor.fixedFee || 0}
                    onChange={(e) => onUpdateVendor({ ...vendor, fixedFee: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={vendor.discountPercent}
                  onChange={(e) => onUpdateVendor({ ...vendor, discountPercent: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SLA Buffer (%)</label>
                <input
                  type="number"
                  value={vendor.slaBufferPercent}
                  onChange={(e) => onUpdateVendor({ ...vendor, slaBufferPercent: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Oversight Hours</label>
                <input
                  type="number"
                  value={vendor.internalOversightHours}
                  onChange={(e) => onUpdateVendor({ ...vendor, internalOversightHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oversight Hourly Rate ($)</label>
                <input
                  type="number"
                  value={vendor.oversightRate}
                  onChange={(e) => onUpdateVendor({ ...vendor, oversightRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
