import React, { useState } from 'react';
import { useCloudStorage } from '../hooks/useCloudStorage';
import { AuthModal } from './AuthModal';

interface CloudSaveButtonProps {
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
  onSaveSuccess?: () => void;
}

export function CloudSaveButton({ calculationData, onSaveSuccess }: CloudSaveButtonProps) {
  const { isAuthenticated, saveCalculation } = useCloudStorage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCalculation({
        ...calculationData,
        notes: notes || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
        isFavorite,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveSuccess(false);
        setNotes('');
        setTags('');
        setIsFavorite(false);
        onSaveSuccess?.();
      }, 1500);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSaveClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        <span>☁️</span>
        <span>Save to Cloud</span>
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowSaveModal(true);
        }}
      />

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>☁️</span>
                Save to Cloud
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Save "{calculationData.projectName}" to your account
              </p>
            </div>

            {saveSuccess ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">✅</div>
                <h4 className="text-xl font-semibold text-gray-900">Saved Successfully!</h4>
                <p className="text-gray-600 mt-2">Your calculation has been saved to the cloud</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this calculation..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., Q4 2024, high priority, approved"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">⭐ Mark as favorite</span>
                </label>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-700 mb-2">Summary</h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{calculationData.roi.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">ROI</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        ${(calculationData.npv / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500">NPV</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {calculationData.paybackPeriod.toFixed(1)}y
                      </div>
                      <div className="text-xs text-gray-500">Payback</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save to Cloud'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
