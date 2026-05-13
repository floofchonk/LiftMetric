import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '@/lib/auth-client';

interface AutoSaveConfig {
  enabled: boolean;
  intervalMs: number;
  debounceMs: number;
}

interface CalculationData {
  projectName: string;
  calculatorType: 'basic' | 'staffing' | 'scientific';
  inputs: Record<string, any>;
  results: Record<string, any>;
  roi: number;
  npv: number;
  paybackPeriod: number;
  irr?: number;
  notes?: string;
  tags?: string[];
}

interface AutoSaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  error: string | null;
}

export function useAutoSave(config: Partial<AutoSaveConfig> = {}) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const createCalculation = useMutation(api.mutations.createCalculation);
  const updateCalculation = useMutation(api.mutations.updateCalculation);

  const defaultConfig: AutoSaveConfig = {
    enabled: true,
    intervalMs: 30000, // 30 seconds
    debounceMs: 2000,  // 2 second debounce
    ...config
  };

  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    hasUnsavedChanges: false,
    autoSaveEnabled: defaultConfig.enabled,
    error: null
  });

  const currentDataRef = useRef<CalculationData | null>(null);
  const currentIdRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save calculation to cloud
  const saveToCloud = useCallback(async (data: CalculationData, existingId?: string): Promise<string | null> => {
    if (!isAuthenticated) {
      setState(prev => ({ ...prev, error: 'Please sign in to save calculations' }));
      return null;
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const saveData = {
        projectName: data.projectName,
        calculatorType: data.calculatorType,
        inputs: JSON.stringify(data.inputs),
        results: JSON.stringify(data.results),
        roi: data.roi,
        npv: data.npv,
        paybackPeriod: data.paybackPeriod,
        irr: data.irr,
        notes: data.notes,
        tags: data.tags?.join(','),
        isFavorite: false
      };

      let savedId: string;
      
      if (existingId) {
        await updateCalculation({
          id: existingId as any,
          ...saveData
        });
        savedId = existingId;
      } else {
        savedId = await createCalculation(saveData);
      }

      setState(prev => ({
        ...prev,
        lastSaved: new Date(),
        isSaving: false,
        hasUnsavedChanges: false,
        error: null
      }));

      currentIdRef.current = savedId;
      return savedId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save';
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: errorMessage
      }));
      return null;
    }
  }, [isAuthenticated, createCalculation, updateCalculation]);

  // Debounced save
  const debouncedSave = useCallback((data: CalculationData) => {
    currentDataRef.current = data;
    setState(prev => ({ ...prev, hasUnsavedChanges: true }));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (state.autoSaveEnabled && isAuthenticated) {
      debounceTimerRef.current = setTimeout(() => {
        saveToCloud(data, currentIdRef.current || undefined);
      }, defaultConfig.debounceMs);
    }
  }, [state.autoSaveEnabled, isAuthenticated, saveToCloud, defaultConfig.debounceMs]);

  // Manual save
  const manualSave = useCallback(async (data: CalculationData) => {
    currentDataRef.current = data;
    return await saveToCloud(data, currentIdRef.current || undefined);
  }, [saveToCloud]);

  // Save as new (create a copy)
  const saveAsNew = useCallback(async (data: CalculationData, newName: string) => {
    currentIdRef.current = null;
    return await saveToCloud({ ...data, projectName: newName });
  }, [saveToCloud]);

  // Toggle auto-save
  const toggleAutoSave = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoSaveEnabled: enabled }));
    
    // Store preference
    localStorage.setItem('liftmetric_autosave_enabled', String(enabled));
  }, []);

  // Load auto-save preference
  useEffect(() => {
    const savedPref = localStorage.getItem('liftmetric_autosave_enabled');
    if (savedPref !== null) {
      setState(prev => ({ ...prev, autoSaveEnabled: savedPref === 'true' }));
    }
  }, []);

  // Periodic auto-save
  useEffect(() => {
    if (state.autoSaveEnabled && isAuthenticated && state.hasUnsavedChanges) {
      autoSaveTimerRef.current = setInterval(() => {
        if (currentDataRef.current && state.hasUnsavedChanges) {
          saveToCloud(currentDataRef.current, currentIdRef.current || undefined);
        }
      }, defaultConfig.intervalMs);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [state.autoSaveEnabled, state.hasUnsavedChanges, isAuthenticated, saveToCloud, defaultConfig.intervalMs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, []);

  // Reset for new calculation
  const resetForNew = useCallback(() => {
    currentIdRef.current = null;
    currentDataRef.current = null;
    setState(prev => ({
      ...prev,
      lastSaved: null,
      hasUnsavedChanges: false,
      error: null
    }));
  }, []);

  // Load existing calculation
  const loadCalculation = useCallback((id: string) => {
    currentIdRef.current = id;
    setState(prev => ({ ...prev, hasUnsavedChanges: false }));
  }, []);

  return {
    ...state,
    isAuthenticated,
    currentId: currentIdRef.current,
    debouncedSave,
    manualSave,
    saveAsNew,
    toggleAutoSave,
    resetForNew,
    loadCalculation
  };
}
