import type { LootTableEntry } from '../types';

export function weightedPick(entries: LootTableEntry[]): LootTableEntry {
  const sum = entries.reduce((acc, entry) => acc + entry.weight, 0);
  let random = Math.random() * sum;
  
  for (const entry of entries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry;
    }
  }
  
  return entries[entries.length - 1];
}

export function getRandomMultiplier(range: [number, number]): number {
  return range[0] + Math.random() * (range[1] - range[0]);
}

