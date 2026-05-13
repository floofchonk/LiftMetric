import { CalculatorResults, Scenario } from '../types/calculator';

// Helper to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Export comparison data
export function exportComparisonToPDF(scenarios: Scenario[], brandSettings?: any): void {
  console.log('Exporting comparison to PDF', scenarios, brandSettings);
  // Implementation placeholder
}

export function exportComparisonToCSV(scenarios: Scenario[], reportName: string): void {
  console.log('Exporting comparison to CSV', scenarios, reportName);
  // Implementation placeholder
}

// Export calculation results
export function exportCalculationToPDF(
  results: CalculatorResults,
  inputs: any,
  brandSettings?: any,
  template?: any
): void {
  console.log('Exporting calculation to PDF', results, inputs, brandSettings, template);
  // Implementation placeholder
}

export function exportCalculationToExcel(results: CalculatorResults, inputs: any): void {
  console.log('Exporting calculation to Excel', results, inputs);
  // Implementation placeholder
}
