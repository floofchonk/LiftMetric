import type { ROIData } from '../types/calculator';

/**
 * Helper to extract ROI percentage from either number or ROIData
 */
export function getRoiPercentage(roi: number | ROIData | undefined): number {
  if (roi === undefined || roi === null) return 0;
  if (typeof roi === 'number') return roi;
  return roi.percentage || 0;
}

/**
 * Helper to extract ROI amount from either number or ROIData
 */
export function getRoiAmount(roi: number | ROIData | undefined): number {
  if (roi === undefined || roi === null) return 0;
  if (typeof roi === 'number') return roi;
  return roi.amount || 0;
}

/**
 * Helper to get full ROI data object
 */
export function normalizeRoi(roi: number | ROIData | undefined): ROIData {
  if (roi === undefined || roi === null) {
    return { percentage: 0, amount: 0 };
  }
  if (typeof roi === 'number') {
    return { percentage: roi, amount: 0 };
  }
  return roi;
}

/**
 * Format ROI percentage for display
 */
export function formatRoiPercentage(roi: number | ROIData | undefined, decimals: number = 1): string {
  const percentage = getRoiPercentage(roi);
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Get cost savings percentage safely
 */
export function getCostSavingsPercentage(costSavings: number | { percentage: number; amount: number } | undefined): number {
  if (costSavings === undefined || costSavings === null) return 0;
  if (typeof costSavings === 'number') return costSavings;
  return costSavings.percentage || 0;
}
