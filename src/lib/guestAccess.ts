import type { Scenario } from '../types/calculator';

const GUEST_SESSION_KEY = 'lift_metric_guest_session';
const GUEST_CALCULATIONS_KEY = 'lift_metric_guest_calculations';
const MAX_GUEST_CALCULATIONS = 3;

export interface GuestSession {
  id: string;
  createdAt: number;
  calculationsUsed: number;
  scenarios: Scenario[];
  lastActive: number;
}

export function initGuestSession(): GuestSession {
  const existingSession = getGuestSession();
  
  if (existingSession && Date.now() - existingSession.lastActive < 7 * 24 * 60 * 60 * 1000) {
    // Session is less than 7 days old, reuse it
    existingSession.lastActive = Date.now();
    saveGuestSession(existingSession);
    return existingSession;
  }

  // Create new session
  const newSession: GuestSession = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    calculationsUsed: 0,
    scenarios: [],
    lastActive: Date.now(),
  };

  saveGuestSession(newSession);
  return newSession;
}

export function getGuestSession(): GuestSession | null {
  const sessionStr = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

export function saveGuestSession(session: GuestSession): void {
  session.lastActive = Date.now();
  localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
}

export function canCreateCalculation(): { allowed: boolean; remaining: number; message?: string } {
  const session = getGuestSession();
  
  if (!session) {
    const newSession = initGuestSession();
    return { allowed: true, remaining: MAX_GUEST_CALCULATIONS };
  }

  const remaining = MAX_GUEST_CALCULATIONS - session.calculationsUsed;
  
  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      message: 'You have reached the limit of free calculations. Please sign up to continue.',
    };
  }

  return { allowed: true, remaining };
}

export function recordCalculation(): void {
  const session = getGuestSession() || initGuestSession();
  session.calculationsUsed += 1;
  saveGuestSession(session);
}

export function saveGuestScenario(scenario: Scenario): void {
  const session = getGuestSession() || initGuestSession();
  
  // Check if scenario already exists
  const existingIndex = session.scenarios.findIndex(s => s.id === scenario.id);
  
  if (existingIndex >= 0) {
    session.scenarios[existingIndex] = scenario;
  } else {
    session.scenarios.push(scenario);
  }
  
  saveGuestSession(session);
}

export function getGuestScenarios(): Scenario[] {
  const session = getGuestSession();
  return session?.scenarios || [];
}

export function deleteGuestScenario(scenarioId: string): void {
  const session = getGuestSession();
  if (!session) return;
  
  session.scenarios = session.scenarios.filter(s => s.id !== scenarioId);
  saveGuestSession(session);
}

export function clearGuestSession(): void {
  localStorage.removeItem(GUEST_SESSION_KEY);
  localStorage.removeItem(GUEST_CALCULATIONS_KEY);
}

export function getGuestSessionStats(): {
  calculationsUsed: number;
  calculationsRemaining: number;
  scenariosCount: number;
  sessionAge: number;
} {
  const session = getGuestSession();
  
  if (!session) {
    return {
      calculationsUsed: 0,
      calculationsRemaining: MAX_GUEST_CALCULATIONS,
      scenariosCount: 0,
      sessionAge: 0,
    };
  }

  return {
    calculationsUsed: session.calculationsUsed,
    calculationsRemaining: MAX_GUEST_CALCULATIONS - session.calculationsUsed,
    scenariosCount: session.scenarios.length,
    sessionAge: Math.floor((Date.now() - session.createdAt) / (1000 * 60 * 60 * 24)), // days
  };
}

export function migrateGuestDataToUser(userId: string): Scenario[] {
  const session = getGuestSession();
  if (!session || session.scenarios.length === 0) {
    return [];
  }

  // Return scenarios to be saved to the user's account
  const scenarios = session.scenarios.map(scenario => ({
    ...scenario,
    userId, // Associate with new user
    createdAt: scenario.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Clear guest session after migration
  clearGuestSession();

  return scenarios;
}

export function shouldPromptSignup(): boolean {
  const session = getGuestSession();
  if (!session) return false;

  // Prompt after 2 calculations or if they have scenarios they might want to save
  return session.calculationsUsed >= 2 || session.scenarios.length >= 2;
}
