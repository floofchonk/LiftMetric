import { useState, useEffect } from 'react';
import type { Scenario } from '../types/scenario';

const STORAGE_KEY = 'staffing_calculator_scenarios';

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Load scenarios from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setScenarios(parsed);
        if (parsed.length > 0 && !activeScenarioId) {
          setActiveScenarioId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to load scenarios:', e);
      }
    }
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    }
  }, [scenarios]);

  const createScenario = (data: Omit<Scenario, 'id' | 'createdAt' | 'lastModified'>) => {
    const newScenario: Scenario = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newScenario.id);
    return newScenario;
  };

  const duplicateScenario = (scenarioId: string, newName?: string) => {
    const original = scenarios.find(s => s.id === scenarioId);
    if (!original) return null;

    const duplicate: Scenario = {
      ...JSON.parse(JSON.stringify(original)), // Deep clone
      id: crypto.randomUUID(),
      name: newName || `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setScenarios([...scenarios, duplicate]);
    setActiveScenarioId(duplicate.id);
    return duplicate;
  };

  const updateScenario = (scenarioId: string, updates: Partial<Scenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { ...s, ...updates, lastModified: new Date().toISOString() }
        : s
    ));
  };

  const deleteScenario = (scenarioId: string) => {
    const filtered = scenarios.filter(s => s.id !== scenarioId);
    setScenarios(filtered);
    if (activeScenarioId === scenarioId) {
      setActiveScenarioId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const getActiveScenario = () => {
    return scenarios.find(s => s.id === activeScenarioId) || null;
  };

  return {
    scenarios,
    activeScenarioId,
    activeScenario: getActiveScenario(),
    setActiveScenarioId,
    createScenario,
    duplicateScenario,
    updateScenario,
    deleteScenario,
  };
}
