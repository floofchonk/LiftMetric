import { CalculationResults } from "../types/calculator";

export function exportComparisonData(results: CalculationResults): string {
  const data = {
    totalRevenue: results.totalRevenue,
    totalCosts: results.totalCosts,
    netProfit: results.netProfit,
    roi: results.roi.percentage,
    paybackPeriod: results.paybackPeriod,
  };
  
  return JSON.stringify(data, null, 2);
}
