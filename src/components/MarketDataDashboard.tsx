import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  RefreshCw,
  WifiOff,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Percent,
  Database,
  Shield,
} from 'lucide-react';
import {
  marketDataService,
  type MarketDataState,
  type RateSnapshot,
  type RateHistory,
} from '../lib/marketDataService';
import { formatCurrency, formatPercent } from '../lib/npvEngine';
import type { ScenarioRateSnapshot } from '../types/market-data';

interface MarketDataDashboardProps {
  scenarios?: { id: string; name: string; ratesAtCreation?: { rateId: string; value: number }[] }[];
  onUpdateScenario?: (scenarioId: string, rateId: string, newValue: number) => void;
  onUpdateAllScenarios?: (scenarioId: string) => void;
  compact?: boolean;
}

interface MarketRate {
  id: string;
  name: string;
  value: number;
  unit: string;
  source: string;
  category: string;
  changePercent?: number;
  previousValue?: number;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; gradient: string; bg: string; text: string; border: string; accent: string }> = {
  interest: {
    label: 'Interest Rates',
    icon: <Percent className="w-4 h-4" />,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    accent: '#3b82f6',
  },
  inflation: {
    label: 'Inflation',
    icon: <TrendingUp className="w-4 h-4" />,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    accent: '#f59e0b',
  },
  bond: {
    label: 'Bond Yields',
    icon: <Shield className="w-4 h-4" />,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    accent: '#10b981',
  },
  economic: {
    label: 'Economic Indicators',
    icon: <Activity className="w-4 h-4" />,
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    accent: '#8b5cf6',
  },
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  if (secs < 10) return 'Just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function MiniSparkline({ values, color, width = 72, height = 32 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 3;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const lastX = ((values.length - 1) / (values.length - 1)) * (width - pad * 2) + pad;
  const lastY = height - pad - ((values[values.length - 1] - min) / range) * (height - pad * 2);

  const areaPath = `M ${pad},${height - pad} ` + values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `L ${x},${y}`;
  }).join(' ') + ` L ${width - pad},${height - pad} Z`;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      <circle cx={lastX} cy={lastY} r="5" fill={color} opacity="0.2">
        <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ChangeBadge({ change }: { change: number }) {
  if (Math.abs(change) < 0.01) {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        <Minus className="w-2.5 h-2.5" />0.00%
      </span>
    );
  }
  const isUp = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
      isUp
        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
    }`}>
      {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
      {isUp ? '+' : ''}{change.toFixed(2)}%
    </span>
  );
}

function StatusPill({ source, isStale, isLoading }: { source: string; isStale: boolean; isLoading: boolean }) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        <RefreshCw className="w-3 h-3 animate-spin" />
        Fetching...
      </span>
    );
  }
  if (source === 'live' && !isStale) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live Data
      </span>
    );
  }
  if (source === 'cached') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <Database className="w-3 h-3" />
        Cached
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
      <WifiOff className="w-3 h-3" />
      Fallback
    </span>
  );
}

export function MarketDataDashboard({
  scenarios = [],
  onUpdateScenario,
  onUpdateAllScenarios,
  compact = false,
}: MarketDataDashboardProps) {
  const [state, setState] = useState(() => marketDataService.getState());
  const [rateHistory, setRateHistory] = useState(() => marketDataService.getRateHistory());
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<'rates' | 'npv'>('rates');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = marketDataService.subscribe((newState) => {
      setState(newState);
      setRateHistory(marketDataService.getRateHistory());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    marketDataService.startLivePolling(30000);
    return () => marketDataService.stopLivePolling();
  }, []);

  const snapshot = state.currentRates;
  const isStale = snapshot.isStale;
  const source = snapshot.source;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Data</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Live rates and NPV calculations</p>
            </div>
          </div>
          <StatusPill source={source} isStale={isStale} isLoading={false} />
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Discount Rate</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{snapshot.discountRate.toFixed(2)}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatTimeAgo(snapshot.timestamp)}</div>
            </div>
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Inflation Rate</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{snapshot.inflationRate.toFixed(2)}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatTimeAgo(snapshot.timestamp)}</div>
            </div>
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Source</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{source}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{rateHistory.length} updates</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('rates')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'rates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Rates
            </button>
            <button
              onClick={() => setActiveView('npv')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'npv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              NPV Calculator
            </button>
          </div>
        </div>

        {activeView === 'rates' && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <span className="font-medium text-blue-900 dark:text-blue-300">Discount Rate</span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-300">{snapshot.discountRate.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <span className="font-medium text-amber-900 dark:text-amber-300">Inflation Rate</span>
                <span className="text-lg font-bold text-amber-900 dark:text-amber-300">{snapshot.inflationRate.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'npv' && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">NPV calculations powered by live market rates</p>
              <p className="text-xs mt-2">Discount Rate: {snapshot.discountRate.toFixed(2)}% | Inflation: {snapshot.inflationRate.toFixed(2)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
