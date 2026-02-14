import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserState, FishingSession, CatchResult, Rod } from '../types';
import { STORAGE_KEY, EXCHANGE_TON_TO_FISH } from '../constants';
import { normalizeSession, createSession } from '../utils/session';
import { weightedPick, getRandomMultiplier } from '../utils/loot';
import rodsData from '../data/rods.json';
import lootTablesData from '../data/lootTables.json';
import type { LootTableEntry } from '../types';

const rods = rodsData as Rod[];
const lootTables = lootTablesData as unknown as Record<string, LootTableEntry[]>;

function generateReferralCode(): string {
  return 'FISH-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function getDefaultState(): UserState {
  const refCode = generateReferralCode();
  return {
    balances: { ton: 12.45, fish: 3200, stars: 0 },
    ownedRods: ['stick'],
    equippedRodId: 'stick',
    session: null,
    market: { listed: [], history: [] },
    inventory: [],
    tasks: {
      daily: { id: 'daily', title: 'Ежедневный заход', desc: 'Зайти в игру', reward: 200, claimedAt: 0 },
      sub: { id: 'sub', title: 'Подписка', desc: 'Подписаться на канал (мок)', reward: 500, claimedAt: 0 },
      invite: { id: 'invite', title: 'Пригласи друга', desc: '1 приглашение (мок)', reward: 1000, claimedAt: 0 },
      firstbuy: { id: 'firstbuy', title: 'Первая покупка', desc: 'Купить любую удочку', reward: 2000, claimedAt: 0 },
    },
    friends: {
      code: refCode,
      level1: {
        invited: 51,
        active: 5,
        earnedFish: 8400,
        percentage: 5.0,
      },
      level2: {
        invited: 3,
        active: 3,
        earnedFish: 3200,
        percentage: 3.0,
      },
      level3: {
        invited: 13,
        active: 1,
        earnedFish: 800,
        percentage: 2.0,
      },
      totalEarnedFish: 12400,
      leaderboard: [
        { name: 'SpeedDial189', earned: 3200 },
        { name: 'TheDarknessG', earned: 2180 },
        { name: 'Serg197205m', earned: 1740 },
        { name: 'Mtprup', earned: 980 },
      ],
    },
    devTap: 0,
  };
}

interface GameStore extends UserState {
  // Actions
  buyRod: (rodId: string, stakeAmount: number) => boolean;
  equipRod: (rodId: string) => void;
  startFishing: (rodId: string, stakeAmount: number) => void;
  claimCatch: () => CatchResult | null;
  sellItem: (itemId: string) => void;
  addToInventory: (item: CatchResult) => void;
  listItem: (itemId: string) => void;
  claimTask: (taskId: string) => boolean;
  devAddResources: () => void;
  fastForwardSession: () => void;
  resetState: () => void;
  // Getters
  getRod: (rodId: string) => Rod | undefined;
  getNormalizedSession: () => FishingSession | null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),

      getRod: (rodId: string) => {
        return rods.find((r) => r.id === rodId);
      },

      getNormalizedSession: () => {
        const session = get().session;
        if (!session) return null;
        const normalized = normalizeSession(session);
        if (normalized && normalized.status !== session.status) {
          set({ session: normalized });
        }
        return normalized;
      },

      buyRod: (rodId: string, stakeAmount: number) => {
        const rod = rods.find((r) => r.id === rodId);
        if (!rod) return false;

        const state = get();

        // Check balance
        if (rod.currency === 'TON') {
          if (state.balances.ton < stakeAmount) return false;
          set((s) => ({
            balances: { ...s.balances, ton: s.balances.ton - stakeAmount },
          }));
        } else if (rod.currency === 'STARS') {
          const stars = state.balances.stars ?? 0;
          if (stars < stakeAmount) return false;
          set((s) => ({
            balances: { ...s.balances, stars: (s.balances.stars ?? 0) - stakeAmount },
          }));
        } else {
          if (state.balances.fish < rod.priceFish!) return false;
          set((s) => ({
            balances: { ...s.balances, fish: s.balances.fish - rod.priceFish! },
          }));
          stakeAmount = rod.priceFish!;
        }

        // Add to owned rods
        set((s) => {
          const owned = s.ownedRods.includes(rodId) ? s.ownedRods : [...s.ownedRods, rodId];
          return {
            ownedRods: owned,
            equippedRodId: rodId,
          };
        });

        // Check firstbuy task
        const tasks = get().tasks;
        if (tasks.firstbuy.claimedAt === 0) {
          get().claimTask('firstbuy');
        }

        return true;
      },

      equipRod: (rodId: string) => {
        const state = get();
        if (!state.ownedRods.includes(rodId)) return;
        set({ equippedRodId: rodId });
      },

      startFishing: (rodId: string, stakeAmount: number) => {
        const rod = rods.find((r) => r.id === rodId);
        if (!rod) return;

        const currency = rod.currency;
        const session = createSession(rodId, stakeAmount, currency);
        set({ session });
      },

      claimCatch: () => {
        const state = get();
        const session = normalizeSession(state.session);
        if (!session || session.status !== 'ready') return null;

        const rod = rods.find((r) => r.id === session.rodId);
        if (!rod) return null;

        const lootTable = lootTables[rod.id] || [];
        if (lootTable.length === 0) return null;

        const picked = weightedPick(lootTable);
        const multiplier = getRandomMultiplier(picked.payoutMulRange);
        const payoutPct = rod.dailyYieldPct * multiplier;

        let payoutTon = 0;
        let payoutFish = 0;
        let payoutStars = 0;

        if (rod.currency === 'TON') {
          payoutTon = session.stakeAmount * payoutPct;
          payoutFish = Math.round(payoutTon * EXCHANGE_TON_TO_FISH);
        } else if (rod.currency === 'STARS') {
          payoutStars = Math.round(session.stakeAmount * payoutPct);
        } else {
          payoutFish = Math.round(session.stakeAmount * (0.06 * multiplier));
        }

        const catchResult: CatchResult = {
          id: `catch_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          rodId: rod.id,
          itemId: picked.itemId,
          name: picked.name,
          type: picked.type,
          payoutTon,
          payoutFish,
          payoutStars,
          createdAt: Date.now(),
          status: 'in_modal',
          icon: picked.icon,
        };

        set((s) => {
          const next: { session: FishingSession; balances?: typeof s.balances } = {
            session: { ...session, status: 'claimed' },
          };
          if (payoutStars > 0) {
            next.balances = { ...s.balances, stars: (s.balances.stars ?? 0) + payoutStars };
          }
          return next;
        });

        return catchResult;
      },

      sellItem: (itemId: string) => {
        const state = get();
        const item = state.market.listed.find((i) => i.id === itemId);
        if (!item) return;

        set((s) => {
          const listed = s.market.listed.filter((i) => i.id !== itemId);
          const history = [...s.market.history, { ...item, soldAt: Date.now(), status: 'sold' as const }];
          const balances = { ...s.balances };
          
          if (item.payoutTon > 0) {
            balances.ton += item.payoutTon;
          } else {
            balances.fish += item.payoutFish;
          }

          return {
            market: { listed, history },
            balances,
          };
        });
      },

      addToInventory: (item: CatchResult) => {
        set((s) => ({
          inventory: [...s.inventory, { ...item, status: 'in_inventory' as const }],
        }));
      },

      listItem: (itemId: string) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        if (!item) return;

        set((s) => ({
          inventory: s.inventory.filter((i) => i.id !== itemId),
          market: {
            ...s.market,
            listed: [...s.market.listed, { ...item, status: 'in_inventory' as const }],
          },
        }));
      },

      claimTask: (taskId: string) => {
        const state = get();
        const task = state.tasks[taskId];
        if (!task) return false;

        const now = Date.now();
        const isDaily = taskId === 'daily';
        const canClaim = isDaily
          ? now - (task.claimedAt || 0) > 24 * 60 * 60 * 1000
          : task.claimedAt === 0;

        if (!canClaim && task.claimedAt > 0) return false;

        set((s) => ({
          tasks: {
            ...s.tasks,
            [taskId]: { ...task, claimedAt: now },
          },
          balances: {
            ...s.balances,
            fish: s.balances.fish + task.reward,
          },
        }));

        return true;
      },

      devAddResources: () => {
        set((s) => ({
          balances: {
            ton: s.balances.ton + 1,
            fish: s.balances.fish + 1000,
          },
          devTap: 0,
        }));
      },

      fastForwardSession: () => {
        const state = get();
        const session = normalizeSession(state.session);
        if (!session || session.status !== 'running') return;

        set({
          session: {
            ...session,
            endAt: Date.now(),
            status: 'ready',
          },
        });
      },

      resetState: () => {
        set(getDefaultState());
      },
    }),
    {
      name: STORAGE_KEY,
      migrate: (persistedState: any) => {
        // Migrate old friends structure to new 3-level structure
        if (persistedState && persistedState.friends) {
          const oldFriends = persistedState.friends;
          // Check if it's old format (has invited, active, earnedFish directly)
          if (oldFriends.invited !== undefined && !oldFriends.level1) {
            // Migrate to new format
            persistedState.friends = {
              code: oldFriends.code || generateReferralCode(),
              level1: {
                invited: oldFriends.invited || 0,
                active: oldFriends.active || 0,
                earnedFish: oldFriends.earnedFish || 0,
                percentage: 5.0,
              },
              level2: {
                invited: 0,
                active: 0,
                earnedFish: 0,
                percentage: 3.0,
              },
              level3: {
                invited: 0,
                active: 0,
                earnedFish: 0,
                percentage: 2.0,
              },
              totalEarnedFish: oldFriends.earnedFish || 0,
              leaderboard: oldFriends.leaderboard || [],
            };
          } else if (oldFriends.level1 && !oldFriends.level1.percentage) {
            // Add percentage to existing levels if missing
            persistedState.friends.level1.percentage = 5.0;
            persistedState.friends.level2.percentage = 3.0;
            persistedState.friends.level3.percentage = 2.0;
          }
        }
        return persistedState as UserState;
      },
      version: 1,
    }
  )
);

// Export rods for use in components
export { rods };

