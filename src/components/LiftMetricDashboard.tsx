import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit3,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Shield,
  Globe,
  Activity,
  Settings,
  Info,
  Lock,
  Unlock,
  Percent,
  Sparkles,
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';
import { calculateNPVWithMarketRates, formatCurrency, formatPercent } from '../lib/npvEngine';
import type { MarketRate } from '../types/market-data';

// ─── Types ───
interface LiftMetricDashboardProps {
  initialInvestment?: number;
  annualCashFlow?: number;
  years?: number;
  onRateChange?: (rateId: string, value: number) => void;
  onNPVCalculated?: (npv: number, irr: number, payback: number) => void;
}

type ViewMode = 'split' | 'rates-only' | 'npv-only';

// ─── Category Styling ───
const CATEGORY_STYLES: Record<string, { label: string; icon: React.ReactNode; gradient: string; bgLight: string; bgDark: string; textColor: string; accentColor: string }> = {
  interest: {
    label: 'Interest Rates',
    icon: <Percent className="w-4 h-4" />,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    accentColor: '#3b82f6',
  },
  inflation: {
    label: 'Inflation',
    icon: <TrendingUp className="w-4 h-4" />,
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    accentColor: '#f59e0b',
  },
  bond: {
    label: 'Bond Yields',
    icon: <Shield className="w-4 h-4" />,
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    accentColor: '#10b981',
  },
  economic: {
    label: 'Economic Indicators',
    icon: <Activity className="w-4 h-4" />,
    gradient: 'from-purple-500 to-violet-500',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    accentColor: '#8b5cf6',
  },
};

// ─── Sparkline Component ───
function Sparkline({ values, color, width = 80, height = 32 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) return <div style={{ width, height }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 3;
  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const lastX = padding + ((values.length - 1) / (values.length - 1)) * (width - padding * 2);
  const lastY = padding + (1 - (values[values.length - 1] - min) / range) * (height - padding * 2);

  // Area fill
  const areaPoints = `${padding},${height - padding} ${points} ${lastX},${height - padding}`;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Change Badge ───
function ChangeBadge({ change }: { change: number }) {
  if (Math.abs(change) < 0.01) {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        0.00%
      </span>
    );
  }
  const isUp = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
      isUp ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
    }`}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? '+' : ''}{change.toFixed(2)}%
    </span>
  );
}

// ─── Rate Row (Side-by-Side) ───
function RateRow({
  rate,
  effectiveValue,
  hasOverride,
  overrideValue,
  onSetOverride,
  onRemoveOverride,
  sparkData,
}: {
  rate: MarketRate;
  effectiveValue: number;
  hasOverride: boolean;
  overrideValue: number | null;
  onSetOverride: (value: number, reason?: string) => void;
  onRemoveOverride: () => void;
  sparkData: number[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const [editReason, setEditReason] = useState('');

  const change = rate.changePercent ?? 0;
  const diff = hasOverride && overrideValue !== null ? overrideValue - rate.value : 0;
  const diffPct = rate.value !== 0 ? (diff / rate.value) * 100 : 0;
  const sparkColor = change > 0 ? '#ef4444' : change < 0 ? '#10b981' : '#6b7280';

  const handleSave = () => {
    const val = parseFloat(editVal);
    if (!isNaN(val) && val >= 0) {
      onSetOverride(val, editReason || undefined);
      setIsEditing(false);
      setEditVal('');
      setEditReason('');
    }
  };

  const handleStartEdit = () => {
    setEditVal(hasOverride && overrideValue !== null ? overrideValue.toString() : rate.value.toString());
    setEditReason('');
    setIsEditing(true);
  };

  return (
    <div className={`group relative transition-all duration-200 ${
      hasOverride
        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-l-2 border-l-amber-400'
        : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/40'
    }`}>
      <div className="grid grid-cols-12 gap-2 items-center px-4 py-3">
        {/* Rate Name & Source */}
        <div className="col-span-3 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{rate.name}</p>
            {hasOverride && (
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-500 truncate">{rate.source}</p>
        </div>

        {/* Sparkline */}
        <div className="col-span-1 flex justify-center">
          <Sparkline values={sparkData} color={sparkColor} width={64} height={28} />
        </div>

        {/* Live Value */}
        <div className="col-span-2 text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5">Live</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
              {rate.value.toFixed(2)}{rate.unit}
            </span>
            <ChangeBadge change={change} />
          </div>
        </div>

        {/* Arrow */}
        <div className="col-span-1 flex justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            hasOverride
              ? 'bg-amber-100 dark:bg-amber-900/40'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <ArrowRight className={`w-4 h-4 ${hasOverride ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Manual / Effective Value */}
        <div className="col-span-3 text-center">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.01"
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }}
                className="w-20 px-2 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none tabular-nums"
                autoFocus
              />
              <button onClick={handleSave} className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5">
                {hasOverride ? 'Manual' : 'Effective'}
              </span>
              <span className={`text-sm font-bold tabular-nums ${
                hasOverride ? 'text-amber-700 dark:text-amber-300' : 'text-gray-900 dark:text-white'
              }`}>
                {effectiveValue.toFixed(2)}{rate.unit}
              </span>
              {hasOverride && Math.abs(diffPct) > 0.01 && (
                <span className={`text-[10px] font-medium ${diffPct > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}% vs live
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex items-center justify-end gap-1">
          {!isEditing && (
            <>
              <button
                onClick={handleStartEdit}
                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100"
                title="Set manual override"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {hasOverride && (
                <button
                  onClick={onRemoveOverride}
                  className="p-1.5 rounded-md text-amber-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
                  title="Remove override"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="p-1.5">
                {hasOverride ? (
                  <Unlock className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NPV Summary Card ───
function NPVSummaryCard({ label, value, subtitle, icon, color, trend }: {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-all duration-300 group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {trend && trend !== 'neutral' && (
        <div className={`absolute bottom-2 right-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 opacity-40" /> : <TrendingDown className="w-4 h-4 opacity-40" />}
        </div>
      )}
    </div>
  );
}

// ─── Status Indicator ───
function StatusIndicator({ source, isLoading, isStale, lastFetched, error }: {
  source: string;
  isLoading: boolean;
  isStale: boolean;
  lastFetched: string | null;
  error: string | null;
}) {
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex items-center gap-3">
      {error ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-xs font-medium text-red-700 dark:text-red-300">Error</span>
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Updating...</span>
        </div>
      ) : source === 'live' ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
          <Wifi className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
        </div>
      ) : isStale ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
          <WifiOff className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Stale</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Cached</span>
        </div>
      )}
      <span className="text-[11px] text-gray-400 dark:text-gray-500">
        Updated {formatTime(lastFetched)}
      </span>
    </div>
  );
}

// ─── Main Dashboard ───
export function LiftMetricDashboard({
  initialInvestment = 500000,
  annualCashFlow = 150000,
  years = 5,
  onRateChange,
  onNPVCalculated,
}: LiftMetricDashboardProps) {
  const {
    rates,
    lastFetched,
    isLoading,
    error,
    isStale,
    source,
    preferences,
    fetchRates,
    getEffectiveRate,
    setOverride,
    removeOverride,
    toggleLiveRates,
  } = useMarketData();

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['interest', 'inflation', 'bond', 'economic']));
  const [showSettings, setShowSettings] = useState(false);
  const [investmentInput, setInvestmentInput] = useState(initialInvestment);
  const [cashFlowInput, setCashFlowInput] = useState(annualCashFlow);
  const [yearsInput, setYearsInput] = useState(years);
  const [taxRate, setTaxRate] = useState(21);
  const [useRealRate, setUseRealRate] = useState(true);

  // Generate sparkline data per rate
  const sparklineData = useMemo(() => {
    const data: Record<string, number[]> = {};
    for (const rate of rates) {
      const base = rate.previousValue ?? rate.value;
      const pts: number[] = [];
      for (let i = 0; i < 10; i++) {
        pts.push(base + (Math.random() - 0.5) * 0.5);
      }
      pts.push(rate.value);
      data[rate.id] = pts;
    }
    return data;
  }, [rates]);

  // Group rates by category
  const groupedRates = useMemo(() => {
    const groups: Record<string, MarketRate[]> = {};
    for (const rate of rates) {
      if (!groups[rate.category]) groups[rate.category] = [];
      groups[rate.category].push(rate);
    }
    return groups;
  }, [rates]);

  // NPV Calculation
  const npvResult = useMemo(() => {
    const discountRate = getEffectiveRate('fed-funds-rate');
    const inflationRate = getEffectiveRate('cpi-inflation');
    return calculateNPVWithMarketRates(investmentInput, cashFlowInput, yearsInput, {
      taxRate,
      useRealRate,
      customDiscountRate: discountRate,
      customInflationRate: inflationRate,
    });
  }, [investmentInput, cashFlowInput, yearsInput, taxRate, useRealRate, getEffectiveRate]);

  useEffect(() => {
    onNPVCalculated?.(npvResult.npv, npvResult.irr, npvResult.paybackPeriod);
  }, [npvResult, onNPVCalculated]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const overrideCount = preferences.overrides.length;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Lift Metric Dashboard</h2>
                <p className="text-blue-100 text-sm">Live market rates &bull; NPV engine &bull; Side-by-side analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator source={source} isLoading={isLoading} isStale={isStale} lastFetched={lastFetched} error={error} />
              <button
                onClick={() => fetchRates()}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all disabled:opacity-50"
                title="Refresh rates"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg backdrop-blur-sm text-white transition-all ${showSettings ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Initial Investment</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={investmentInput}
                    onChange={(e) => setInvestmentInput(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Annual Cash Flow</label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={cashFlowInput}
                    onChange={(e) => setCashFlowInput(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Projection Years</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={yearsInput}
                  onChange={(e) => setYearsInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRealRate}
                  onChange={(e) => setUseRealRate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Use inflation-adjusted (real) discount rate</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.useLiveRates}
                  onChange={(e) => toggleLiveRates(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto-refresh live rates</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* NPV Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <NPVSummaryCard
          label="Net Present Value"
          value={formatCurrency(npvResult.npv)}
          subtitle={npvResult.npv >= 0 ? 'Project is viable' : 'Below threshold'}
          icon={<DollarSign className="w-5 h-5" />}
          color={npvResult.npv >= 0 ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-rose-500'}
          trend={npvResult.npv >= 0 ? 'up' : 'down'}
        />
        <NPVSummaryCard
          label="Internal Rate of Return"
          value={formatPercent(npvResult.irr)}
          subtitle={`vs ${formatPercent(getEffectiveRate('fed-funds-rate'))} discount rate`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="from-blue-500 to-indigo-500"
          trend={npvResult.irr > getEffectiveRate('fed-funds-rate') ? 'up' : 'down'}
        />
        <NPVSummaryCard
          label="Payback Period"
          value={`${npvResult.paybackPeriod.toFixed(1)} yrs`}
          subtitle={`Discounted: ${npvResult.discountedPayback.toFixed(1)} yrs`}
          icon={<Clock className="w-5 h-5" />}
          color="from-amber-500 to-orange-500"
          trend={npvResult.paybackPeriod <= yearsInput ? 'up' : 'down'}
        />
        <NPVSummaryCard
          label="Profitability Index"
          value={npvResult.profitabilityIndex.toFixed(2) + 'x'}
          subtitle={npvResult.profitabilityIndex >= 1 ? 'Above breakeven' : 'Below breakeven'}
          icon={<Sparkles className="w-5 h-5" />}
          color="from-purple-500 to-violet-500"
          trend={npvResult.profitabilityIndex >= 1 ? 'up' : 'down'}
        />
      </div>

      {/* Override Count Banner */}
      {overrideCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <span className="font-semibold">{overrideCount} manual override{overrideCount > 1 ? 's' : ''}</span> active — NPV calculations use your custom values instead of live market data.
          </p>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {([
          { key: 'split', label: 'Split View', icon: <Layers className="w-3.5 h-3.5" /> },
          { key: 'rates-only', label: 'Rates Only', icon: <Globe className="w-3.5 h-3.5" /> },
          { key: 'npv-only', label: 'NPV Detail', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        ] as { key: ViewMode; label: string; icon: React.ReactNode }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'lg:grid-cols-3' : ''}`}>
        {/* Rates Panel */}
        {(viewMode === 'split' || viewMode === 'rates-only') && (
          <div className={viewMode === 'split' ? 'lg:col-span-2' : ''}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</div>
                <div className="col-span-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Trend</div>
                <div className="col-span-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  <span className="inline-flex items-center gap-1"><Wifi className="w-3 h-3" /> Live</span>
                </div>
                <div className="col-span-1" />
                <div className="col-span-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  <span className="inline-flex items-center gap-1"><Edit3 className="w-3 h-3" /> Manual</span>
                </div>
                <div className="col-span-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</div>
              </div>

              {/* Rate Categories */}
              {Object.entries(groupedRates).map(([category, categoryRates]) => {
                const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.economic;
                const isExpanded = expandedCategories.has(category);

                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 ${style.bgLight} ${style.bgDark} border-b border-gray-100 dark:border-gray-800 hover:opacity-90 transition-all`}
                    >
                      <div className={`p-1 rounded-md bg-gradient-to-br ${style.gradient} text-white`}>
                        {style.icon}
                      </div>
                      <span className={`text-sm font-semibold ${style.textColor}`}>{style.label}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">({categoryRates.length})</span>
                      <div className="flex-1" />
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {isExpanded && categoryRates.map(rate => {
                      const override = preferences.overrides.find(o => o.rateId === rate.id);
                      const hasOverride = !!override;
                      const effectiveValue = getEffectiveRate(rate.id);

                      return (
                        <RateRow
                          key={rate.id}
                          rate={rate}
                          effectiveValue={effectiveValue}
                          hasOverride={hasOverride}
                          overrideValue={override?.manualValue ?? null}
                          onSetOverride={(val, reason) => {
                            setOverride(rate.id, val, reason);
                            onRateChange?.(rate.id, val);
                          }}
                          onRemoveOverride={() => removeOverride(rate.id)}
                          sparkData={sparklineData[rate.id] || [rate.value]}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NPV Detail Panel */}
        {(viewMode === 'split' || viewMode === 'npv-only') && (
          <div className={viewMode === 'split' ? 'lg:col-span-1' : ''}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden sticky top-4">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                    <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">NPV Analysis</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Key Inputs Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inputs</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Investment</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(investmentInput)}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Cash Flow/yr</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(cashFlowInput)}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Discount Rate</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatPercent(getEffectiveRate('fed-funds-rate'))}</p>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Inflation</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatPercent(getEffectiveRate('cpi-inflation'))}</p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Results</h4>
                  <div className="space-y-2">
                    <div className={`px-3 py-3 rounded-lg border ${
                      npvResult.npv >= 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Net Present Value</p>
                      <p className={`text-xl font-bold tabular-nums ${
                        npvResult.npv >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                      }`}>
                        {formatCurrency(npvResult.npv)}
                      </p>
                    </div>

                    {[
                      { label: 'IRR', value: formatPercent(npvResult.irr) },
                      { label: 'Payback', value: `${npvResult.paybackPeriod.toFixed(1)} years` },
                      { label: 'Disc. Payback', value: `${npvResult.discountedPayback.toFixed(1)} years` },
                      { label: 'Profitability Idx', value: `${npvResult.profitabilityIndex.toFixed(3)}x` },
                      { label: 'Real Disc. Rate', value: formatPercent(npvResult.realDiscountRate) },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cash Flow Timeline */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cumulative Cash Flow</h4>
                  <div className="h-24 relative">
                    <CashFlowChart data={npvResult.cumulativeCashFlows} investment={investmentInput} />
                  </div>
                </div>

                {/* Decision */}
                <div className={`px-4 py-3 rounded-xl border ${
                  npvResult.npv >= 0 && npvResult.profitabilityIndex >= 1
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {npvResult.npv >= 0 && npvResult.profitabilityIndex >= 1 ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Recommended: Proceed</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">NPV positive with PI above 1.0</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-bold text-red-700 dark:text-red-300">Caution: Review Required</p>
                          <p className="text-xs text-red-600 dark:text-red-400">NPV or PI below threshold</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cash Flow Chart ───
function CashFlowChart({ data, investment }: { data: number[]; investment: number }) {
  if (data.length === 0) return null;

  const allValues = [-investment, ...data];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const w = 280;
  const h = 96;
  const pad = 8;

  const toY = (v: number) => pad + (1 - (v - min) / range) * (h - pad * 2);
  const zeroY = toY(0);

  const points = data.map((v, i) => {
    const x = pad + ((i + 1) / data.length) * (w - pad * 2);
    const y = toY(v);
    return { x, y, v };
  });

  const startX = pad;
  const startY = toY(-investment);

  const linePath = `M ${startX} ${startY} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')}`;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - pad} L ${startX} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Zero line */}
      <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="4 2" />
      {/* Area */}
      <path d={areaPath} fill="url(#cfGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Start dot */}
      <circle cx={startX} cy={startY} r="3" fill="#ef4444" />
      {/* End dot */}
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#10b981" />
      )}
      {/* Labels */}
      <text x={startX + 4} y={startY - 6} fontSize="9" fill="#ef4444" fontWeight="600">-{formatCurrency(investment)}</text>
      {points.length > 0 && (
        <text x={points[points.length - 1].x - 4} y={points[points.length - 1].y - 6} fontSize="9" fill="#10b981" fontWeight="600" textAnchor="end">
          {formatCurrency(points[points.length - 1].v)}
        </text>
      )}
    </svg>
  );
}

export default LiftMetricDashboard;
