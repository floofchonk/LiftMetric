import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '@/lib/auth-client';

export interface CalculationData {
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
  isFavorite?: boolean;
}

export interface ReportData {
  calculationId: string;
  title: string;
  topMetrics: { name: string; value: number; status: string }[];
  chartData: { year: number; revenue: number; costs: number; profit: number }[];
  recommendations: string[];
  notes?: string;
  branding?: { companyName?: string; logo?: string; colors?: { primary: string; secondary: string } };
}

export interface ComparisonData {
  title: string;
  calculationAId: string;
  calculationBId: string;
  winnerMetrics: { metric: string; winner: 'A' | 'B'; difference: number }[];
  notes?: string;
}

export function useCloudStorage() {
  const { data: session } = useSession();
  
  const createCalculation = useMutation(api.mutations.createCalculation);
  const updateCalculation = useMutation(api.mutations.updateCalculation);
  const deleteCalculation = useMutation(api.mutations.deleteCalculation);
  
  const createReport = useMutation(api.mutations.createExecutiveReport);
  const createComparison = useMutation(api.mutations.createComparison);

  const saveCalculation = async (data: CalculationData) => {
    if (!session) {
      throw new Error('Must be signed in to save calculations');
    }

    return await createCalculation({
      projectName: data.projectName,
      calculatorType: data.calculatorType,
      inputs: JSON.stringify(data.inputs),
      results: JSON.stringify(data.results),
      roi: data.roi,
      npv: data.npv,
      paybackPeriod: data.paybackPeriod,
      irr: data.irr,
      notes: data.notes,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      isFavorite: data.isFavorite ?? false,
    });
  };

  const saveReport = async (data: ReportData) => {
    if (!session) {
      throw new Error('Must be signed in to save reports');
    }

    return await createReport({
      calculationId: data.calculationId as any,
      title: data.title,
      topMetrics: JSON.stringify(data.topMetrics),
      chartData: JSON.stringify(data.chartData),
      recommendations: JSON.stringify(data.recommendations),
      notes: data.notes,
      branding: data.branding ? JSON.stringify(data.branding) : undefined,
    });
  };

  const saveComparison = async (data: ComparisonData) => {
    if (!session) {
      throw new Error('Must be signed in to save comparisons');
    }

    return await createComparison({
      title: data.title,
      calculationAId: data.calculationAId as any,
      calculationBId: data.calculationBId as any,
      winnerMetrics: JSON.stringify(data.winnerMetrics),
      notes: data.notes,
    });
  };

  return {
    isAuthenticated: !!session,
    user: session?.user,
    saveCalculation,
    saveReport,
    saveComparison,
    updateCalculation,
    deleteCalculation,
  };
}
