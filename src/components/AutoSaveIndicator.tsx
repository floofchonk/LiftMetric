import React from 'react';

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  isAuthenticated: boolean;
  error: string | null;
  onToggleAutoSave: (enabled: boolean) => void;
  onManualSave: () => void;
}

export function AutoSaveIndicator({
  lastSaved,
  isSaving,
  hasUnsavedChanges,
  autoSaveEnabled,
  isAuthenticated,
  error,
  onToggleAutoSave,
  onManualSave
}: AutoSaveIndicatorProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
        <span>☁️</span>
        <span>Sign in to enable cloud save</span>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Indicator */}
      <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-all ${
        error 
          ? 'bg-red-100 text-red-700'
          : isSaving
            ? 'bg-blue-100 text-blue-700'
            : hasUnsavedChanges
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
      }`}>
        {error ? (
          <>
            <span>⚠️</span>
            <span>Save failed</span>
          </>
        ) : isSaving ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Saving...</span>
          </>
        ) : hasUnsavedChanges ? (
          <>
            <span>●</span>
            <span>Unsaved changes</span>
          </>
        ) : lastSaved ? (
          <>
            <span>✓</span>
            <span>Saved {formatTime(lastSaved)}</span>
          </>
        ) : (
          <>
            <span>☁️</span>
            <span>Cloud ready</span>
          </>
        )}
      </div>

      {/* Manual Save Button */}
      {hasUnsavedChanges && !isSaving && (
        <button
          onClick={onManualSave}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Now
        </button>
      )}

      {/* Auto-save Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => onToggleAutoSave(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${
            autoSaveEnabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
              autoSaveEnabled ? 'translate-x-5' : 'translate-x-0.5'
            } mt-0.5`} />
          </div>
        </div>
        <span className="text-sm text-gray-600">Auto-save</span>
      </label>
    </div>
  );
}
