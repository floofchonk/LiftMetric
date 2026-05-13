import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '@/lib/auth-client';
import { AuthModal } from './AuthModal';

interface SaveCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationData: {
    projectName: string;
    calculatorType: 'basic' | 'staffing' | 'scientific';
    inputs: Record<string, any>;
    results: Record<string, any>;
    roi: number;
    npv: number;
    paybackPeriod: number;
    irr?: number;
  };
  onSaveSuccess?: (id: string) => void;
  mode?: 'save' | 'saveAs';
  existingId?: string;
}

export function SaveCalculationModal({
  isOpen,
  onClose,
  calculationData,
  onSaveSuccess,
  mode = 'save',
  existingId
}: SaveCalculationModalProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const createCalculation = useMutation(api.mutations.createCalculation);
  const updateCalculation = useMutation(api.mutations.updateCalculation);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [projectName, setProjectName] = useState(calculationData.projectName);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const saveData = {
        projectName: projectName.trim(),
        calculatorType: calculationData.calculatorType,
        inputs: JSON.stringify(calculationData.inputs),
        results: JSON.stringify(calculationData.results),
        roi: calculationData.roi,
        npv: calculationData.npv,
        paybackPeriod: calculationData.paybackPeriod,
        irr: calculationData.irr,
        notes: notes || undefined,
        tags: tags || undefined,
        isFavorite
      };

      let savedId: string;

      if (mode === 'save' && existingId) {
        await updateCalculation({
          id: existingId as any,
          ...saveData
        });
        savedId = existingId;
      } else {
        savedId = await createCalculation(saveData);
      }

      setSaveSuccess(true);
      
      setTimeout(() => {
        onSaveSuccess?.(savedId);
        onClose();
        // Reset state
        setSaveSuccess(false);
        setNotes('');
        setTags('');
        setIsFavorite(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save calculation');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{mode === 'saveAs' ? '📋' : '💾'}</span>
              {mode === 'saveAs' ? 'Save as New Calculation' : 'Save Calculation'}
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              {mode === 'saveAs' 
                ? 'Create a copy with a new name'
                : 'Save your calculation to the cloud'
              }
            </p>
          </div>

          {saveSuccess ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">✅</div>
              <h4 className="text-xl font-semibold text-gray-900">Saved Successfully!</h4>
              <p className="text-gray-600 mt-2">
                Your calculation has been saved to the cloud
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter a name for this calculation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes, assumptions, or context for this calculation..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-400">(optional, comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Q4 2024, high priority, approved, phase-1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tags help you organize and filter calculations later
                </p>
              </div>

              {/* Favorite Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-gray-700 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Mark as favorite
                </span>
              </label>

              {/* Summary Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>📊</span> Calculation Summary
                </h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className={`text-xl font-bold ${calculationData.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculationData.roi.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">ROI</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className={`text-xl font-bold ${calculationData.npv >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(calculationData.npv)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">NPV</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xl font-bold text-purple-600">
                      {calculationData.paybackPeriod.toFixed(1)}y
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Payback</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Calculator: {calculationData.calculatorType.charAt(0).toUpperCase() + calculationData.calculatorType.slice(1)}
                </div>
              </div>

              {/* Auto-save info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
                <span>💡</span>
                <span>Your calculations are automatically saved when you&apos;re signed in</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !projectName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      {mode === 'saveAs' ? 'Save as New' : 'Save to Cloud'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Retry save after auth
          handleSave();
        }}
      />
    </>
  );
}
