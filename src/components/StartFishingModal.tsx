import { useState } from 'react';
import { useGameStore, rods } from '../store/gameStore';
import { getRarityColors } from '../utils/rarity';

interface StartFishingModalProps {
  rodId: string;
  onStart: (stakeAmount: number) => void;
  onClose: () => void;
}

const rodIcons: Record<string, string> = {
  stick: '🪵',
  reed: '🌾',
  bamboo: '🎋',
  telescopic: '📏',
  spinning: '🎣',
  feeder: '🧺',
  boom: '💥',
};

export function StartFishingModal({ rodId, onStart, onClose }: StartFishingModalProps) {
  const rod = rods.find((r) => r.id === rodId);
  const ownedRods = useGameStore((s) => s.ownedRods);
  const balances = useGameStore((s) => s.balances);

  if (!rod) return null;

  const isOwned = ownedRods.includes(rodId);
  const defaultStake =
    rod.currency === 'TON'
      ? Math.max(rod.minStake, Math.min(rod.maxStake, rod.minStake + (rod.maxStake - rod.minStake) * 0.55))
      : rod.priceFish || rod.minStake;

  const [stakeAmount, setStakeAmount] = useState(defaultStake);

  const canAfford =
    rod.currency === 'TON'
      ? balances.ton >= stakeAmount
      : balances.fish >= (rod.priceFish || rod.minStake);

  const handleStart = () => {
    if (!canAfford && !isOwned) return;
    onStart(rod.currency === 'TON' ? stakeAmount : (rod.priceFish || rod.minStake));
  };

  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.28)] flex items-center justify-center z-20 p-4.5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[90vh] rounded-[32px] glass-card shadow-[0_28px_80px_rgba(0,30,45,.35)] overflow-hidden animate-pop-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4.5 pb-0 flex-shrink-0">
          <h2 className="m-0 text-lg font-black font-heading">Начать рыбалку</h2>
          <p className="mt-1.5 mb-0 text-muted font-extrabold text-xs break-words">
            {rod.name} • {rod.rarity}
          </p>
        </div>
        <div className="px-4.5 pb-4.5 grid gap-2.5 overflow-y-auto flex-1 min-h-0">
          <div className="game-card">
            <div className="flex gap-2.5 items-start">
              <div className="w-[54px] h-[54px] rounded-[18px] bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center relative overflow-hidden">
                <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.65),rgba(255,255,255,0)_55%)] rotate-[18deg]"></div>
                <span className="text-2xl z-[2]">{rodIcons[rod.id] || '🎣'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="m-0 text-base font-black tracking-wide break-words">{rod.name}</h3>
                <div className="mt-0.5 flex gap-2 flex-wrap items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-black ${getRarityColors(rod.rarity).bg} ${getRarityColors(rod.rarity).text} ${getRarityColors(rod.rarity).border}`}
                  >
                    {rod.rarity}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                    <strong className="text-ink">{rod.currency}</strong>{' '}
                    {rod.currency === 'TON'
                      ? `${rod.minStake}–${rod.maxStake}`
                      : `${rod.priceFish}`}
                  </span>
                  {rod.dailyYieldPct > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                      <strong className="text-ink">
                        {(rod.dailyYieldPct * 100).toFixed(1)}%/сутки
                      </strong>
                    </span>
                  )}
                </div>
                {rod.currency === 'TON' && (
                  <div className="mt-2.5 px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85">
                    <div className="flex justify-between items-center font-black text-xs text-muted mb-2.5">
                      <span>Сумма</span>
                      <span className="text-xs text-muted">
                        {rod.minStake}–{rod.maxStake} TON
                      </span>
                    </div>
                    <input
                      type="number"
                      min={rod.minStake}
                      max={rod.maxStake}
                      step={rod.minStake < 1 ? 0.1 : 1}
                      value={stakeAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || rod.minStake;
                        const clamped = Math.max(rod.minStake, Math.min(rod.maxStake, value));
                        setStakeAmount(clamped);
                      }}
                      className="w-full px-3 py-2.5 rounded-[14px] bg-white/80 border border-white/90 font-black text-ink text-base focus:outline-none focus:ring-2 focus:ring-sun/50"
                      placeholder="Введи сумму покупки"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className={`game-button ${!canAfford && !isOwned ? 'opacity-50' : ''} flex-shrink-0`}
            onClick={handleStart}
            disabled={!canAfford && !isOwned}
          >
            {isOwned ? 'Закинуть' : canAfford ? 'Купить и закинуть' : 'Недостаточно средств'}
          </button>
          <button
            className="w-full px-3.5 py-3.5 rounded-[18px] border border-white/92 bg-white/62 font-black cursor-pointer shadow-game-sm flex-shrink-0"
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

