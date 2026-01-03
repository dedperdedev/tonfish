import type { FishingSession } from '../types';
import { SESSION_DURATION_MS } from '../constants';

export function normalizeSession(session: FishingSession | null): FishingSession | null {
  if (!session) return null;
  
  if (session.status === 'running' && Date.now() >= session.endAt) {
    session.status = 'ready';
  }
  
  return session;
}

export function createSession(rodId: string, stakeAmount: number, currency: 'TON' | 'FISH'): FishingSession {
  const now = Date.now();
  return {
    id: `session_${now}`,
    rodId,
    stakeAmount,
    currency,
    startAt: now,
    endAt: now + SESSION_DURATION_MS,
    status: 'running',
  };
}

export function formatTime(ms: number): string {
  ms = Math.max(0, ms);
  const seconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

export function getTimeRemaining(session: FishingSession): number {
  return Math.max(0, session.endAt - Date.now());
}

export function getProgress(session: FishingSession): number {
  const total = session.endAt - session.startAt;
  const remaining = getTimeRemaining(session);
  return Math.max(0, Math.min(1, 1 - (remaining / total)));
}

