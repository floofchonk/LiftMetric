export interface MarketRate {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  source: string;
  sourceUrl?: string;
  category: 'interest' | 'inflation' | 'bond' | 'economic';
  lastUpdated: string;
  previousValue?: number;
  changePercent?: number;
}

export interface MarketDataState {
  rates: MarketRate[];
  lastFetched: string | null;
  isLoading: boolean;
  error: string | null;
  isStale: boolean;
  source: 'live' | 'cached' | 'fallback';
}

export interface RateOverride {
  rateId: string;
  manualValue: number;
  reason?: string;
  setAt: string;
}

export interface UserRatePreferences {
  useLiveRates: boolean;
  overrides: RateOverride[];
  autoUpdateScenarios: boolean;
  refreshIntervalMinutes: number;
}

export interface ScenarioRateSnapshot {
  scenarioId: string;
  scenarioName: string;
  ratesAtCreation: { rateId: string; value: number }[];
  createdAt: string;
  isOutdated: boolean;
  outdatedRates: { rateId: string; oldValue: number; newValue: number; changePct: number }[];
}

export interface NPVCalculationParams {
  initialInvestment: number;
  cashFlows: number[];
  discountRate: number;
  inflationRate: number;
  taxRate?: number;
  residualValue?: number;
  useRealRate: boolean;
}

export interface NPVResult {
  npv: number;
  irr: number;
  paybackPeriod: number;
  discountedPayback: number;
  profitabilityIndex: number;
  realDiscountRate: number;
  nominalDiscountRate: number;
  inflationAdjustedCashFlows: number[];
  cumulativeCashFlows: number[];
}

export const DEFAULT_MARKET_RATES: MarketRate[] = [
  {
    id: 'fed-funds-rate',
    name: 'Federal Funds Rate',
    description: 'The interest rate at which banks lend reserve balances to other banks overnight',
    value: 5.33,
    unit: '%',
    source: 'Federal Reserve',
    sourceUrl: 'https://www.federalreserve.gov',
    category: 'interest',
    lastUpdated: new Date().toISOString(),
    previousValue: 5.33,
    changePercent: 0,
  },
  {
    id: 'prime-rate',
    name: 'Prime Rate',
    description: 'The base rate banks use for lending to their most creditworthy customers',
    value: 8.50,
    unit: '%',
    source: 'Wall Street Journal',
    sourceUrl: 'https://www.wsj.com',
    category: 'interest',
    lastUpdated: new Date().toISOString(),
    previousValue: 8.50,
    changePercent: 0,
  },
  {
    id: 'cpi-inflation',
    name: 'CPI Inflation Rate',
    description: 'Consumer Price Index year-over-year change measuring inflation',
    value: 3.0,
    unit: '%',
    source: 'Bureau of Labor Statistics',
    sourceUrl: 'https://www.bls.gov',
    category: 'inflation',
    lastUpdated: new Date().toISOString(),
    previousValue: 3.2,
    changePercent: -6.25,
  },
  {
    id: 'pce-inflation',
    name: 'PCE Inflation Rate',
    description: 'Personal Consumption Expenditures price index, the Fed\'s preferred inflation measure',
    value: 2.7,
    unit: '%',
    source: 'Bureau of Economic Analysis',
    sourceUrl: 'https://www.bea.gov',
    category: 'inflation',
    lastUpdated: new Date().toISOString(),
    previousValue: 2.8,
    changePercent: -3.57,
  },
  {
    id: 'treasury-10y',
    name: '10-Year Treasury Yield',
    description: 'Yield on 10-year U.S. government bonds, a key benchmark for long-term rates',
    value: 4.25,
    unit: '%',
    source: 'U.S. Treasury',
    sourceUrl: 'https://www.treasury.gov',
    category: 'bond',
    lastUpdated: new Date().toISOString(),
    previousValue: 4.30,
    changePercent: -1.16,
  },
  {
    id: 'treasury-2y',
    name: '2-Year Treasury Yield',
    description: 'Yield on 2-year U.S. government bonds, sensitive to Fed policy expectations',
    value: 4.72,
    unit: '%',
    source: 'U.S. Treasury',
    sourceUrl: 'https://www.treasury.gov',
    category: 'bond',
    lastUpdated: new Date().toISOString(),
    previousValue: 4.80,
    changePercent: -1.67,
  },
  {
    id: 'gdp-growth',
    name: 'GDP Growth Rate',
    description: 'Annualized real GDP growth rate for the U.S. economy',
    value: 2.8,
    unit: '%',
    source: 'Bureau of Economic Analysis',
    sourceUrl: 'https://www.bea.gov',
    category: 'economic',
    lastUpdated: new Date().toISOString(),
    previousValue: 3.4,
    changePercent: -17.65,
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    description: 'Percentage of the labor force that is unemployed and actively seeking work',
    value: 4.1,
    unit: '%',
    source: 'Bureau of Labor Statistics',
    sourceUrl: 'https://www.bls.gov',
    category: 'economic',
    lastUpdated: new Date().toISOString(),
    previousValue: 3.9,
    changePercent: 5.13,
  },
];

export const DEFAULT_USER_RATE_PREFERENCES: UserRatePreferences = {
  useLiveRates: true,
  overrides: [],
  autoUpdateScenarios: false,
  refreshIntervalMinutes: 30,
};
