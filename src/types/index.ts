export interface Rod {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Apex';
  currency: 'TON' | 'FISH';
  minStake: number;
  maxStake: number;
  priceFish?: number;
  dailyYieldPct: number;
  loot: string[];
  iconPath?: string;
}

export interface LootTableEntry {
  itemId: string;
  name: string;
  type: 'fish' | 'junk';
  weight: number;
  payoutMulRange: [number, number];
  iconPath?: string;
}

export interface FishingSession {
  id: string;
  rodId: string;
  stakeAmount: number;
  currency: 'TON' | 'FISH';
  startAt: number;
  endAt: number;
  status: 'idle' | 'running' | 'ready' | 'claimed';
}

export interface CatchResult {
  id: string;
  rodId: string;
  itemId: string;
  name: string;
  type: 'fish' | 'junk';
  payoutTon: number;
  payoutFish: number;
  createdAt: number;
  soldAt?: number;
  status?: 'in_modal' | 'in_inventory' | 'sold';
  iconPath?: string;
}

export interface Task {
  id: string;
  title: string;
  desc: string;
  reward: number;
  claimedAt: number;
  iconPath?: string;
}

export interface ReferralLevel {
  invited: number;
  active: number;
  earnedFish: number;
  percentage: number; // Процент комиссии для уровня
}

export interface FriendsState {
  code: string;
  level1: ReferralLevel;
  level2: ReferralLevel;
  level3: ReferralLevel;
  totalEarnedFish: number;
  leaderboard: Array<{
    name: string;
    earned: number;
  }>;
}

export interface UserState {
  balances: {
    ton: number;
    fish: number;
  };
  ownedRods: string[];
  equippedRodId: string | null;
  session: FishingSession | null;
  inventory: CatchResult[];
  market: {
    listed: CatchResult[];
    history: CatchResult[];
  };
  tasks: Record<string, Task>;
  friends: FriendsState;
  devTap: number;
}

