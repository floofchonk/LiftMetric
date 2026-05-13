import type { NPVCalculationParams, NPVResult } from '../types/market-data';

// ─── Core NPV Calculation ───
export function calculateNPVAdvanced(params: NPVCalculationParams): NPVResult {
  const {
    initialInvestment,
    cashFlows,
    discountRate,
    inflationRate,
    taxRate = 0,
    residualValue = 0,
    useRealRate,
  } = params;

  // Fisher equation: real rate = (1 + nominal) / (1 + inflation) - 1
  const nominalRate = discountRate / 100;
  const inflRate = inflationRate / 100;
  const realRate = (1 + nominalRate) / (1 + inflRate) - 1;
  const activeRate = useRealRate ? realRate : nominalRate;

  // Inflation-adjusted cash flows
  const inflationAdjustedCashFlows = cashFlows.map((cf, i) => {
    const afterTax = cf * (1 - taxRate / 100);
    return useRealRate ? afterTax : afterTax / Math.pow(1 + inflRate, i + 1);
  });

  // NPV
  let npv = -initialInvestment;
  const cumulativeCashFlows: number[] = [];
  let cumulative = -initialInvestment;

  for (let i = 0; i < inflationAdjustedCashFlows.length; i++) {
    const dcf = inflationAdjustedCashFlows[i] / Math.pow(1 + activeRate, i + 1);
    npv += dcf;
    cumulative += dcf;
    cumulativeCashFlows.push(cumulative);
  }

  // Add residual value
  if (residualValue > 0) {
    const discountedResidual = residualValue / Math.pow(1 + activeRate, cashFlows.length);
    npv += discountedResidual;
    cumulative += discountedResidual;
    cumulativeCashFlows[cumulativeCashFlows.length - 1] = cumulative;
  }

  // Payback period (simple)
  let paybackPeriod = cashFlows.length;
  let cumulativeCheck = -initialInvestment;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCheck += cashFlows[i] * (1 - taxRate / 100);
    if (cumulativeCheck >= 0) {
      const prevCumulative = cumulativeCheck - cashFlows[i] * (1 - taxRate / 100);
      paybackPeriod = i + (-prevCumulative) / (cashFlows[i] * (1 - taxRate / 100));
      break;
    }
  }

  // Discounted payback period
  let discountedPayback = cashFlows.length;
  let discCumulative = -initialInvestment;
  for (let i = 0; i < inflationAdjustedCashFlows.length; i++) {
    const dcf = inflationAdjustedCashFlows[i] / Math.pow(1 + activeRate, i + 1);
    const prevDiscCumulative = discCumulative;
    discCumulative += dcf;
    if (discCumulative >= 0) {
      discountedPayback = i + (-prevDiscCumulative) / dcf;
      break;
    }
  }

  // Profitability Index
  const profitabilityIndex = initialInvestment > 0 ? (npv + initialInvestment) / initialInvestment : 0;

  // IRR (Newton-Raphson)
  const irr = calculateIRRNewton(initialInvestment, cashFlows.map(cf => cf * (1 - taxRate / 100)), residualValue);

  return {
    npv,
    irr,
    paybackPeriod,
    discountedPayback,
    profitabilityIndex,
    realDiscountRate: realRate * 100,
    nominalDiscountRate: discountRate,
    inflationAdjustedCashFlows,
    cumulativeCashFlows,
  };
}

// ─── IRR via Newton-Raphson ───
function calculateIRRNewton(investment: number, cashFlows: number[], residualValue: number = 0): number {
  let guess = 0.1;
  const n = cashFlows.length;

  for (let iter = 0; iter < 200; iter++) {
    let fVal = -investment;
    let fDeriv = 0;

    for (let i = 0; i < n; i++) {
      const t = i + 1;
      fVal += cashFlows[i] / Math.pow(1 + guess, t);
      fDeriv -= (t * cashFlows[i]) / Math.pow(1 + guess, t + 1);
    }

    if (residualValue > 0) {
      fVal += residualValue / Math.pow(1 + guess, n);
      fDeriv -= (n * residualValue) / Math.pow(1 + guess, n + 1);
    }

    if (Math.abs(fDeriv) < 1e-12) break;
    const newGuess = guess - fVal / fDeriv;
    if (Math.abs(newGuess - guess) < 1e-8) return newGuess * 100;
    guess = newGuess;
    if (guess < -0.99) guess = -0.5;
    if (guess > 10) guess = 5;
  }

  return guess * 100;
}

// ─── Quick NPV with Market Rates ───
export function calculateNPVWithMarketRates(
  initialInvestment: number,
  annualCashFlow: number,
  years: number,
  options?: {
    taxRate?: number;
    residualValue?: number;
    useRealRate?: boolean;
    customDiscountRate?: number;
    customInflationRate?: number;
  }
): NPVResult {
  const discountRate = options?.customDiscountRate ?? 8.0;
  const inflationRate = options?.customInflationRate ?? 3.0;
  const cashFlows = Array(years).fill(annualCashFlow);

  return calculateNPVAdvanced({
    initialInvestment,
    cashFlows,
    discountRate,
    inflationRate,
    taxRate: options?.taxRate ?? 0,
    residualValue: options?.residualValue ?? 0,
    useRealRate: options?.useRealRate ?? true,
  });
}

// ─── Sensitivity Analysis ───
export interface SensitivityPoint {
  label: string;
  discountRate: number;
  inflationRate: number;
  npv: number;
  irr: number;
  paybackPeriod: number;
  profitabilityIndex: number;
}

export function runSensitivityAnalysis(
  initialInvestment: number,
  annualCashFlow: number,
  years: number,
  baseDiscountRate: number,
  baseInflationRate: number,
  variationPct: number = 25
): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];
  const steps = [-variationPct, -variationPct / 2, 0, variationPct / 2, variationPct];

  for (const step of steps) {
    const dr = baseDiscountRate * (1 + step / 100);
    const ir = baseInflationRate * (1 + step / 100);
    const result = calculateNPVWithMarketRates(initialInvestment, annualCashFlow, years, {
      customDiscountRate: dr,
      customInflationRate: ir,
      useRealRate: true,
    });

    points.push({
      label: step === 0 ? 'Base' : `${step > 0 ? '+' : ''}${step}%`,
      discountRate: dr,
      inflationRate: ir,
      npv: result.npv,
      irr: result.irr,
      paybackPeriod: result.paybackPeriod,
      profitabilityIndex: result.profitabilityIndex,
    });
  }

  return points;
}

// ─── Format Helpers ───
export function formatCurrency(val: number): string {
  if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toFixed(0)}`;
}

export function formatPercent(val: number, decimals: number = 1): string {
  return `${val.toFixed(decimals)}%`;
}
