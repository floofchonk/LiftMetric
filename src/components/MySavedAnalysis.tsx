import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '@/lib/auth-client';
import { Id } from '../../convex/_generated/dataModel';
import { AuthModal } from './AuthModal';

interface MySavedAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCalculation: (data: any, id: string) => void;
  onCompare: (calcA: any, calcB: any) => void;
  onViewReport?: (calculationId: string) => void;
}

export function MySavedAnalysis({
  isOpen,
  onClose,
  onLoadCalculation,
  onCompare,
  onViewReport
}: MySavedAnalysisProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const calculations = useQuery(api.queries.listCalculations, isAuthenticated ? {} : 'skip');
  const reports = useQuery(api.queries.listExecutiveReports, isAuthenticated ? {} : 'skip');
  const comparisons = useQuery(api.queries.listComparisons, isAuthenticated ? {} : 'skip');
  
  const deleteCalculation = useMutation(api.mutations.deleteCalculation);
  const updateCalculation = useMutation(api.mutations.updateCalculation);
  const deleteReport = useMutation(api.mutations.deleteExecutiveReport);
  const deleteComparison = useMutation(api.mutations.deleteComparison);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculations' | 'reports' | 'comparisons'>('calculations');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'roi' | 'npv'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const filteredCalculations = useMemo(() => {
    if (!calculations) return [];
    
    let filtered = [...calculations];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.projectName.toLowerCase().includes(term) ||
        (c.notes && c.notes.toLowerCase().includes(term)) ||
        (c.tags && c.tags.toLowerCase().includes(term))
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.calculatorType === filterType);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date': return b._creationTime - a._creationTime;
        case 'name': return a.projectName.localeCompare(b.projectName);
        case 'roi': return b.roi - a.roi;
        case 'npv': return b.npv - a.npv;
        default: return 0;
      }
    });
    
    return filtered;
  }, [calculations, searchTerm, sortBy, filterType]);

  const stats = useMemo(() => {
    if (!calculations || calculations.length === 0) return null;
    return {
      total: calculations.length,
      avgROI: calculations.reduce((sum, c) => sum + c.roi, 0) / calculations.length,
      totalNPV: calculations.reduce((sum, c) => sum + c.npv, 0),
      favorites: calculations.filter(c => c.isFavorite).length,
      byType: {
        basic: calculations.filter(c => c.calculatorType === 'basic').length,
        staffing: calculations.filter(c => c.calculatorType === 'staffing').length,
        scientific: calculations.filter(c => c.calculatorType === 'scientific').length
      }
    };
  }, [calculations]);

  const handleDelete = async (id: string, type: 'calculation' | 'report' | 'comparison') => {
    try {
      if (type === 'calculation') {
        await deleteCalculation({ id: id as Id<"calculations"> });
      } else if (type === 'report') {
        await deleteReport({ id: id as Id<"executiveReports"> });
      } else {
        await deleteComparison({ id: id as Id<"comparisons"> });
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    await updateCalculation({ 
      id: id as Id<"calculations">, 
      isFavorite: !currentFavorite 
    });
  };

  const handleRename = async (id: string) => {
    if (newName.trim()) {
      await updateCalculation({
        id: id as Id<"calculations">,
        projectName: newName.trim()
      });
      setEditingName(null);
      setNewName('');
    }
  };

  const handleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(i => i !== id));
    } else if (selectedForCompare.length < 2) {
      setSelectedForCompare(prev => [...prev, id]);
    }
  };

  const handleCompareSelected = () => {
    if (selectedForCompare.length === 2) {
      const calcA = calculations?.find(c => c._id === selectedForCompare[0]);
      const calcB = calculations?.find(c => c._id === selectedForCompare[1]);
      if (calcA && calcB) {
        onCompare(
          { ...JSON.parse(calcA.inputs), ...JSON.parse(calcA.results), projectName: calcA.projectName, _id: calcA._id },
          { ...JSON.parse(calcB.inputs), ...JSON.parse(calcB.results), projectName: calcB.projectName, _id: calcB._id }
        );
      }
    }
  };

  const handleLoadCalculation = (calc: any) => {
    const loadedData = {
      ...JSON.parse(calc.inputs),
      ...JSON.parse(calc.results),
      projectName: calc.projectName,
      notes: calc.notes,
      tags: calc.tags
    };
    onLoadCalculation(loadedData, calc._id);
  };

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCalculatorTypeLabel = (type: string) => {
    const labels: Record<string, { icon: string; label: string; color: string }> = {
      basic: { icon: '🧮', label: 'Basic', color: 'bg-blue-100 text-blue-700' },
      staffing: { icon: '👥', label: 'Staffing', color: 'bg-purple-100 text-purple-700' },
      scientific: { icon: '🔬', label: 'Scientific', color: 'bg-green-100 text-green-700' }
    };
    return labels[type] || { icon: '📊', label: type, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">📁</span>
                  My Saved Analyses
                </h2>
                <p className="text-blue-100 mt-1">
                  {isAuthenticated 
                    ? `${calculations?.length || 0} calculations saved to cloud`
                    : 'Sign in to access your saved analyses'
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign in to Access</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Sign in to view your saved calculations, executive reports, and comparisons across all your devices.
              </p>
              <button
                onClick={handleAuthRequired}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
              >
                Sign In to Continue
              </button>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              {stats && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-xs text-gray-500">Total Calculations</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">{stats.avgROI.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Average ROI</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalNPV)}</div>
                      <div className="text-xs text-gray-500">Total NPV Analyzed</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-yellow-600">{stats.favorites}</div>
                      <div className="text-xs text-gray-500">Favorites</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b px-6">
                <div className="flex gap-1">
                  {[
                    { id: 'calculations', label: 'Calculations', icon: '🧮', count: calculations?.length },
                    { id: 'reports', label: 'Reports', icon: '📊', count: reports?.length },
                    { id: 'comparisons', label: 'Comparisons', icon: '⚖️', count: comparisons?.length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{tab.icon}</span>
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Filters */}
              {activeTab === 'calculations' && (
                <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, notes, or tags..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="basic">Basic</option>
                    <option value="staffing">Staffing</option>
                    <option value="scientific">Scientific</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="roi">Sort by ROI</option>
                    <option value="npv">Sort by NPV</option>
                  </select>

                  {selectedForCompare.length > 0 && (
                    <button
                      onClick={handleCompareSelected}
                      disabled={selectedForCompare.length !== 2}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span>⚖️</span>
                      Compare ({selectedForCompare.length}/2)
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'calculations' && (
                  <div className="space-y-4">
                    {filteredCalculations.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-4">📭</div>
                        <h4 className="text-lg font-medium text-gray-900">No calculations found</h4>
                        <p className="text-gray-500 mt-1">
                          {searchTerm || filterType !== 'all' 
                            ? 'Try adjusting your search or filters'
                            : 'Start by creating a new calculation'
                          }
                        </p>
                      </div>
                    ) : (
                      filteredCalculations.map(calc => {
                        const typeInfo = getCalculatorTypeLabel(calc.calculatorType);
                        const isSelected = selectedForCompare.includes(calc._id);
                        
                        return (
                          <div
                            key={calc._id}
                            className={`bg-white rounded-xl border-2 transition-all ${
                              isSelected 
                                ? 'border-purple-400 shadow-lg shadow-purple-100' 
                                : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                {/* Left: Selection & Info */}
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => handleSelectForCompare(calc._id)}
                                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                      isSelected 
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'border-gray-300 hover:border-purple-400'
                                    }`}
                                  >
                                    {isSelected && <span className="text-xs">✓</span>}
                                  </button>
                                  
                                  <div className="flex-1">
                                    {editingName === calc._id ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={newName}
                                          onChange={(e) => setNewName(e.target.value)}
                                          className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                                          autoFocus
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRename(calc._id);
                                            if (e.key === 'Escape') { setEditingName(null); setNewName(''); }
                                          }}
                                        />
                                        <button onClick={() => handleRename(calc._id)} className="text-green-600 hover:text-green-700">✓</button>
                                        <button onClick={() => { setEditingName(null); setNewName(''); }} className="text-gray-400 hover:text-gray-600">✕</button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900">{calc.projectName}</h4>
                                        <button
                                          onClick={() => handleToggleFavorite(calc._id, calc.isFavorite)}
                                          className={`transition-colors ${calc.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                                        >
                                          ⭐
                                        </button>
                                        <button
                                          onClick={() => { setEditingName(calc._id); setNewName(calc.projectName); }}
                                          className="text-gray-400 hover:text-gray-600"
                                          title="Rename"
                                        >
                                          ✏️
                                        </button>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                        {typeInfo.icon} {typeInfo.label}
                                      </span>
                                      <span>{formatDate(calc._creationTime)}</span>
                                    </div>
                                    
                                    {calc.notes && (
                                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{calc.notes}</p>
                                    )}
                                    
                                    {calc.tags && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {calc.tags.split(',').map((tag, i) => (
                                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                            {tag.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Metrics */}
                                <div className="flex items-center gap-6">
                                  <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                      <div className={`text-lg font-bold ${calc.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {calc.roi.toFixed(1)}%
                                      </div>
                                      <div className="text-xs text-gray-500">ROI</div>
                                    </div>
                                    <div>
                                      <div className={`text-lg font-bold ${calc.npv >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {formatCurrency(calc.npv)}
                                      </div>
                                      <div className="text-xs text-gray-500">NPV</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-purple-600">
                                        {calc.paybackPeriod.toFixed(1)}y
                                      </div>
                                      <div className="text-xs text-gray-500">Payback</div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleLoadCalculation(calc)}
                                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                      Load
                                    </button>
                                    {onViewReport && (
                                      <button
                                        onClick={() => onViewReport(calc._id)}
                                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                      >
                                        Report
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setShowDeleteConfirm(calc._id)}
                                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delete Confirmation */}
                            {showDeleteConfirm === calc._id && (
                              <div className="px-4 pb-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                                  <span className="text-red-700 text-sm">Delete this calculation?</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleDelete(calc._id, 'calculation')}
                                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    {!reports || reports.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-4">📊</div>
                        <h4 className="text-lg font-medium text-gray-900">No reports yet</h4>
                        <p className="text-gray-500 mt-1">Generate an executive report from any calculation</p>
                      </div>
                    ) : (
                      reports.map(report => (
                        <div key={report._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{report.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{formatDate(report._creationTime)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(report._id, 'report')}
                                className="p-2 text-gray-400 hover:text-red-600"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'comparisons' && (
                  <div className="space-y-4">
                    {!comparisons || comparisons.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-4">⚖️</div>
                        <h4 className="text-lg font-medium text-gray-900">No comparisons saved</h4>
                        <p className="text-gray-500 mt-1">Select two calculations to compare them</p>
                      </div>
                    ) : (
                      comparisons.map(comparison => (
                        <div key={comparison._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{comparison.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{formatDate(comparison._creationTime)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(comparison._id, 'comparison')}
                                className="p-2 text-gray-400 hover:text-red-600"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
