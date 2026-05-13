// Market Data Service - Live rate polling with caching and staleness detection
import type { MarketRate, ScenarioRateSnapshot } from '../types/market-data';
import { DEFAULT_MARKET_RATES } from '../types/market-data';

export interface RateSnapshot {
  discountRate: number
  inflationRate: number
  timestamp: number
  source: 'live' | 'cached' | 'fallback'
  isStale: boolean
}

export interface RateHistory {
  timestamp: number
  discountRate: number
  inflationRate: number
}

export interface MarketDataState {
  currentRates: RateSnapshot
  rateHistory: RateHistory[]
  isLiveMode: boolean
  manualOverride: { discountRate?: number; inflationRate?: number } | null
  lastUpdateTime: number
  staleDuration: number // milliseconds before data is considered stale
}

const DEFAULT_DISCOUNT_RATE = 0.08
const DEFAULT_INFLATION_RATE = 0.03
const STALE_DURATION = 5 * 60 * 1000 // 5 minutes
const HISTORY_LIMIT = 100

// ─── Event System ───
type MarketDataEventType = 'rates-updated' | 'staleness-changed' | 'mode-changed';
type MarketDataEventListener = () => void;

const eventListeners: Map<MarketDataEventType, Set<MarketDataEventListener>> = new Map();

export function onMarketDataEvent(event: MarketDataEventType, listener: MarketDataEventListener): () => void {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event)!.add(listener);
  return () => {
    eventListeners.get(event)?.delete(listener);
  };
}

function emitMarketDataEvent(event: MarketDataEventType) {
  eventListeners.get(event)?.forEach(listener => {
    try { listener(); } catch (e) { console.error('Market data event listener error:', e); }
  });
}

// ─── Staleness Checking ───
// Check if a scenario's saved rates are stale compared to current market rates
export function checkScenarioStaleness(
  scenarioId: string,
  scenarioName: string,
  ratesAtCreation: { rateId: string; value: number }[]
): ScenarioRateSnapshot {
  const currentRates = DEFAULT_MARKET_RATES;
  const outdatedRates = ratesAtCreation
    .map(snap => {
      const current = currentRates.find(r => r.id === snap.rateId);
      if (!current) return null;
      const changePct = snap.value !== 0 ? ((current.value - snap.value) / snap.value) * 100 : 0;
      if (Math.abs(changePct) > 0.5) {
        return {
          rateId: snap.rateId,
          oldValue: snap.value,
          newValue: current.value,
          changePct: parseFloat(changePct.toFixed(2)),
        };
      }
      return null;
    })
    .filter(Boolean) as ScenarioRateSnapshot['outdatedRates'];

  return {
    scenarioId,
    scenarioName,
    ratesAtCreation,
    createdAt: new Date().toISOString(),
    isOutdated: outdatedRates.length > 0,
    outdatedRates,
  };
}

// Get current rate snapshot for saving with a scenario
export function getCurrentRateSnapshot(): { rateId: string; value: number }[] {
  return DEFAULT_MARKET_RATES.map(r => ({
    rateId: r.id,
    value: r.value,
  }));
}

// Get effective rate by id (used by npvEngine)
export function getEffectiveRate(rateId: string): number {
  const state = marketDataService.getState();
  // Check manual overrides first
  if (state.manualOverride) {
    if (rateId === 'fed-funds-rate' && state.manualOverride.discountRate !== undefined) {
      return state.manualOverride.discountRate;
    }
    if (rateId === 'cpi-inflation' && state.manualOverride.inflationRate !== undefined) {
      return state.manualOverride.inflationRate;
    }
  }
  // Fall back to default market rates
  const rate = DEFAULT_MARKET_RATES.find(r => r.id === rateId);
  return rate?.value ?? 0;
}

// ─── Market Data Service Class ───
class MarketDataService {
  private state: MarketDataState
  private listeners: Set<(state: MarketDataState) => void> = new Set()
  private pollInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.state = {
      currentRates: {
        discountRate: DEFAULT_DISCOUNT_RATE,
        inflationRate: DEFAULT_INFLATION_RATE,
        timestamp: Date.now(),
        source: 'fallback',
        isStale: false,
      },
      rateHistory: [],
      isLiveMode: true,
      manualOverride: null,
      lastUpdateTime: Date.now(),
      staleDuration: STALE_DURATION,
    }
  }

  // Subscribe to state changes
  subscribe(listener: (state: MarketDataState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  // Get current state
  getState(): MarketDataState {
    return { ...this.state }
  }

  // Simulate live market data fetch
  private async fetchLiveRates(): Promise<{ discountRate: number; inflationRate: number }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const baseDiscount = DEFAULT_DISCOUNT_RATE
        const baseInflation = DEFAULT_INFLATION_RATE
        const discountVariation = (Math.random() - 0.5) * 0.01
        const inflationVariation = (Math.random() - 0.5) * 0.005

        resolve({
          discountRate: Math.max(0.01, baseDiscount + discountVariation),
          inflationRate: Math.max(0.001, baseInflation + inflationVariation),
        })
      }, 300)
    })
  }

  // Start polling for live rates
  startLivePolling(intervalMs: number = 30000) {
    if (this.pollInterval) clearInterval(this.pollInterval)

    this.state.isLiveMode = true
    this.pollOnce()

    this.pollInterval = setInterval(() => {
      this.pollOnce()
    }, intervalMs)
  }

  // Poll once for live rates
  private async pollOnce() {
    if (!this.state.isLiveMode) return

    try {
      const liveRates = await this.fetchLiveRates()
      const finalRates = this.state.manualOverride
        ? {
            discountRate: this.state.manualOverride.discountRate ?? liveRates.discountRate,
            inflationRate: this.state.manualOverride.inflationRate ?? liveRates.inflationRate,
          }
        : liveRates

      this.updateRates(finalRates.discountRate, finalRates.inflationRate, 'live')
      emitMarketDataEvent('rates-updated')
    } catch (error) {
      console.error('Failed to fetch live rates:', error)
      this.state.currentRates.source = 'cached'
      this.notify()
    }
  }

  // Stop polling
  stopLivePolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.state.isLiveMode = false
    emitMarketDataEvent('mode-changed')
    this.notify()
  }

  // Update rates and add to history
  private updateRates(discountRate: number, inflationRate: number, source: 'live' | 'cached' | 'fallback') {
    const now = Date.now()
    const wasStale = this.state.currentRates.isStale
    const isStale = source === 'cached' && now - this.state.lastUpdateTime > this.state.staleDuration

    this.state.currentRates = {
      discountRate,
      inflationRate,
      timestamp: now,
      source,
      isStale,
    }

    this.state.lastUpdateTime = now

    // Add to history
    this.state.rateHistory.push({
      timestamp: now,
      discountRate,
      inflationRate,
    })

    // Limit history size
    if (this.state.rateHistory.length > HISTORY_LIMIT) {
      this.state.rateHistory = this.state.rateHistory.slice(-HISTORY_LIMIT)
    }

    if (wasStale !== isStale) {
      emitMarketDataEvent('staleness-changed')
    }

    this.notify()
  }

  // Set manual rate override
  setManualOverride(discountRate?: number, inflationRate?: number) {
    this.state.manualOverride = {
      discountRate,
      inflationRate,
    }

    const finalRates = {
      discountRate: discountRate ?? this.state.currentRates.discountRate,
      inflationRate: inflationRate ?? this.state.currentRates.inflationRate,
    }

    this.updateRates(finalRates.discountRate, finalRates.inflationRate, 'live')
  }

  // Clear manual override
  clearManualOverride() {
    this.state.manualOverride = null
    this.notify()
  }

  // Get current rate snapshot
  getCurrentRateSnapshot(): RateSnapshot {
    return { ...this.state.currentRates }
  }

  // Get rate history
  getRateHistory(): RateHistory[] {
    return [...this.state.rateHistory]
  }

  // Check if rates are stale
  isRatesStale(): boolean {
    return this.state.currentRates.isStale
  }

  // Get time since last update (in seconds)
  getTimeSinceLastUpdate(): number {
    return (Date.now() - this.state.lastUpdateTime) / 1000
  }

  // Set staleness duration
  setStaleDuration(ms: number) {
    this.state.staleDuration = ms
    this.notify()
  }

  // Cleanup
  destroy() {
    this.stopLivePolling()
    this.listeners.clear()
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()
