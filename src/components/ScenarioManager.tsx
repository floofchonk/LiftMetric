import React, { useState } from 'react';
import { Copy, Trash2, Plus, Check, X, Edit2 } from 'lucide-react';
import type { Scenario } from '../types/scenario';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  onSelectScenario: (id: string) => void;
  onDuplicateScenario: (id: string, name?: string) => void;
  onDeleteScenario: (id: string) => void;
  onCreateScenario: () => void;
  onRenameScenario: (id: string, name: string) => void;
}

export function ScenarioManager({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onDuplicateScenario,
  onDeleteScenario,
  onCreateScenario,
  onRenameScenario,
}: ScenarioManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (scenario: Scenario) => {
    setEditingId(scenario.id);
    setEditName(scenario.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onRenameScenario(id, editName.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Scenario Management</h2>
        <button
          onClick={onCreateScenario}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {scenarios.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            No scenarios yet. Create your first scenario to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                activeScenarioId === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {editingId === scenario.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(scenario.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button
                        onClick={() => saveEdit(scenario.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg touch-manipulation"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectScenario(scenario.id)}
                      className="text-left w-full touch-manipulation"
                    >
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{scenario.name}</h3>
                      {scenario.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scenario.description}</p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Last modified: {new Date(scenario.lastModified).toLocaleDateString()}
                      </p>
                    </button>
                  )}
                </div>

                {editingId !== scenario.id && (
                  <div className="flex sm:flex-row flex-col items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(scenario)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-manipulation"
                      title="Rename scenario"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => onDuplicateScenario(scenario.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 touch-manipulation"
                      title="Duplicate scenario"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {scenarios.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
                            onDeleteScenario(scenario.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 touch-manipulation"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
