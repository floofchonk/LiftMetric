import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '@/lib/auth-client';
import { Id } from '../../convex/_generated/dataModel';

interface SavedAnalysisViewProps {
  onClose: () => void;
  onLoadCalculation: (data: any) => void;
  onCompare: (calcA: any, calcB: any) => void;
}

export function SavedAnalysisView({ onClose, onLoadCalculation, onCompare }: SavedAnalysisViewProps) {
  const { data: session } = useSession();
  const calculations = useQuery(api.queries.listCalculations, session ? {} : 'skip');
  const deleteCalculation = useMutation(api.mutations.deleteCalculation);
  const updateCalculation = useMutation(api.mutations.updateCalculation);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'roi' | 'name'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'calculations' | 'reports' | 'comparisons'>('calculations');

  const reports = useQuery(api.queries.listExecutiveReports, session ? {} : 'skip');
  const comparisons = useQuery(api.queries.listComparisons, session ? {} : 'skip');

  const filteredCalculations = React.useMemo(() => {
    if (!calculations) return [];
    
    let filtered = [...calculations];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.calculatorType === filterType);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'date') return b._creationTime - a._creationTime;
      if (sortBy === 'roi') return b.roi - a.roi;
      if (sortBy === 'name') return a.projectName.localeCompare(b.projectName);
      return 0;
    });
    
    return filtered;
  }, [calculations, searchTerm, sortBy, filterType]);

  const handleDelete = async (id: Id<"calculations">) => {
    if (confirm('Are you sure you want to delete this calculation?')) {
      await deleteCalculation({ id });
    }
  };

  const handleToggleFavorite = async (id: Id<"calculations">, currentFavorite: boolean) => {
    await updateCalculation({ id, isFavorite: !currentFavorite });
  };

  const handleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else if (selectedForCompare.length < 2) {
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      const calcA = calculations?.find(c => c._id === selectedForCompare[0]);
      const calcB = calculations?.find(c => c._id === selectedForCompare[1]);
      if (calcA && calcB) {
        onCompare(
          { ...JSON.parse(calcA.inputs), ...JSON.parse(calcA.results), projectName: calcA.projectName },
          { ...JSON.parse(calcB.inputs), ...JSON.parse(calcB.results), projectName: calcB.projectName }
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = React.useMemo(() => {
    if (!calculations || calculations.length === 0) return null;
    const totalROI = calculations.reduce((sum, c) => sum + c.roi, 0);
    const totalNPV = calculations.reduce((sum, c) => sum + c.npv, 0);
    const favorites = calculations.filter(c => c.isFavorite).length;
    return {
      count: calculations.length,
      avgROI: totalROI / calculations.length,
      totalNPV,
      favorites
    };
  }, [calculations]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📁</span>
                My Saved Analyses
              </h2>
              <p className="text-blue-100 mt-1">Access your calculation history and reports</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats Row */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{stats.count}</div>
                <div className="text-blue-100 text-sm">Calculations</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{stats.avgROI.toFixed(1)}%</div>
                <div className="text-blue-100 text-sm">Avg ROI</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalNPV)}</div>
                <div className="text-blue-100 text-sm">Total NPV</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{stats.favorites}</div>
                <div className="text-blue-100 text-sm">Favorites</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'calculations', label: 'Calculations', icon: '🧮', count: calculations?.length || 0 },
              { id: 'reports', label: 'Reports', icon: '📊', count: reports?.length || 0 },
              { id: 'comparisons', label: 'Comparisons', icon: '⚖️', count: comparisons?.length || 0 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-white/20'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'calculations' && (
            <>
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search calculations..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="basic">Basic Calculator</option>
                  <option value="staffing">Staffing Calculator</option>
                  <option value="scientific">Scientific Mode</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="roi">Sort by ROI</option>
                  <option value="name">Sort by Name</option>
                </select>
                {selectedForCompare.length === 2 && (
                  <button
                    onClick={handleCompare}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    ⚖️ Compare Selected
                  </button>
                )}
              </div>

              {/* Calculations Grid */}
              {!calculations ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">⏳</div>
                  <p className="text-gray-500">Loading your calculations...</p>
                </div>
              ) : filteredCalculations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Calculations Found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start by running a new ROI calculation'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCalculations.map((calc) => (
                    <div
                      key={calc._id}
                      className={`bg-white border-2 rounded-xl p-5 hover:shadow-lg transition-all ${
                        selectedForCompare.includes(calc._id) 
                          ? 'border-indigo-500 ring-2 ring-indigo-200' 
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{calc.projectName}</h3>
                          <p className="text-sm text-gray-500">{formatDate(calc._creationTime)}</p>
                        </div>
                        <button
                          onClick={() => handleToggleFavorite(calc._id, calc.isFavorite)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {calc.isFavorite ? '⭐' : '☆'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-green-600">{calc.roi.toFixed(1)}%</div>
                          <div className="text-xs text-green-700">ROI</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-blue-600">{calc.paybackPeriod.toFixed(1)}y</div>
                          <div className="text-xs text-blue-700">Payback</div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                          {calc.calculatorType}
                        </span>
                        {calc.notes && (
                          <p className="mt-2 line-clamp-2 text-gray-500">{calc.notes}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const inputs = JSON.parse(calc.inputs);
                            const results = JSON.parse(calc.results);
                            onLoadCalculation({ ...inputs, ...results, projectName: calc.projectName });
                          }}
                          className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleSelectForCompare(calc._id)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedForCompare.includes(calc._id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedForCompare.includes(calc._id) ? '✓' : '⚖️'}
                        </button>
                        <button
                          onClick={() => handleDelete(calc._id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-12">
              {reports && reports.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {reports.map((report) => (
                    <div key={report._id} className="bg-white border rounded-xl p-5 text-left">
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(report._creationTime)}</p>
                      {report.notes && <p className="text-gray-600 mt-2">{report.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Yet</h3>
                  <p className="text-gray-500">Generate an executive report after running a calculation</p>
                </>
              )}
            </div>
          )}

          {activeTab === 'comparisons' && (
            <div className="text-center py-12">
              {comparisons && comparisons.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {comparisons.map((comp) => (
                    <div key={comp._id} className="bg-white border rounded-xl p-5 text-left">
                      <h3 className="font-semibold text-gray-900">{comp.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(comp._creationTime)}</p>
                      {comp.notes && <p className="text-gray-600 mt-2">{comp.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Comparisons Yet</h3>
                  <p className="text-gray-500">Select two calculations to compare them side-by-side</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
