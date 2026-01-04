import { useState } from 'react';
import { useGameStore, rods } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { formatTon, formatFish } from '../utils/formatters';
import { getRarityColors } from '../utils/rarity';
import { triggerHaptic } from '../utils/haptics';

export function ShopPage() {
  const [tab, setTab] = useState<'shop' | 'inv'>('shop');
  const ownedRods = useGameStore((s) => s.ownedRods);
  const equippedRodId = useGameStore((s) => s.equippedRodId);
  const inventory = useGameStore((s) => s.inventory);
  const equipRod = useGameStore((s) => s.equipRod);
  const buyRod = useGameStore((s) => s.buyRod);
  const listItem = useGameStore((s) => s.listItem);

  const [stakeAmounts, setStakeAmounts] = useState<Record<string, number>>({});

  const handleBuy = (rodId: string) => {
    const rod = rods.find((r) => r.id === rodId);
    if (!rod) return;

    const stake =
      rod.currency === 'TON'
        ? stakeAmounts[rodId] || rod.minStake
        : rod.priceFish || rod.minStake;

    if (buyRod(rodId, stake)) {
      // Success handled by store
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <LakeBackground opacity={0.25} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col pr-2 pb-[calc(var(--safe-bottom)+0px)] pl-2 overflow-hidden" style={{ margin: 0, border: 0, paddingTop: '5px' }}>
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pb-24 -webkit-overflow-scrolling-touch">
          <div className="flex justify-center mb-2.5">
            <div className="inline-flex gap-1.5 p-1.5 rounded-full bg-white/62 border border-white/86 shadow-game-sm backdrop-blur-[12px]">
              <button
                className={`border-0 rounded-full px-3 py-2.5 font-black bg-transparent cursor-pointer transition-all ${
                  tab === 'shop'
                    ? 'bg-gradient-to-br from-sun/55 to-sun2/45 text-[#281600] shadow-[0_10px_22px_rgba(255,156,30,.22)]'
                    : 'text-muted'
                }`}
                onClick={() => setTab('shop')}
              >
                Магазин
              </button>
              <button
                className={`border-0 rounded-full px-3 py-2.5 font-black bg-transparent cursor-pointer transition-all ${
                  tab === 'inv'
                    ? 'bg-gradient-to-br from-sun/55 to-sun2/45 text-[#281600] shadow-[0_10px_22px_rgba(255,156,30,.22)]'
                    : 'text-muted'
                }`}
                onClick={() => setTab('inv')}
              >
                Инвентарь
              </button>
            </div>
          </div>
          {tab === 'shop' ? (
            <div className="grid gap-2.5">
              {rods.map((rod) => {
                const owned = ownedRods.includes(rod.id);
                const equipped = equippedRodId === rod.id;

                const rarityColors = getRarityColors(rod.rarity);
                // Get rarity tint color for background (5-8% opacity)
                const rarityTintMap: Record<string, string> = {
                  Common: 'rgba(156, 163, 175, 0.06)', // gray
                  Uncommon: 'rgba(34, 197, 94, 0.07)', // green
                  Rare: 'rgba(59, 130, 246, 0.07)', // blue
                  Epic: 'rgba(168, 85, 247, 0.08)', // purple
                  Legendary: 'rgba(251, 191, 36, 0.08)', // yellow
                  Mythic: 'rgba(236, 72, 153, 0.08)', // pink
                  Apex: 'rgba(239, 68, 68, 0.08)', // red
                };
                const rarityTint = rarityTintMap[rod.rarity] || 'rgba(156, 163, 175, 0.06)';
                
                // Get rarity accent line color
                const rarityLineMap: Record<string, string> = {
                  Common: 'rgba(156, 163, 175, 0.4)',
                  Uncommon: 'rgba(34, 197, 94, 0.5)',
                  Rare: 'rgba(59, 130, 246, 0.5)',
                  Epic: 'rgba(168, 85, 247, 0.5)',
                  Legendary: 'rgba(251, 191, 36, 0.5)',
                  Mythic: 'rgba(236, 72, 153, 0.5)',
                  Apex: 'rgba(239, 68, 68, 0.6)',
                };
                const rarityLineColor = rarityLineMap[rod.rarity] || 'rgba(156, 163, 175, 0.4)';

                return (
                  <div 
                    key={rod.id} 
                    className="game-card relative overflow-visible"
                    style={{
                      background: `linear-gradient(to right, ${rarityTint} 0%, transparent 8%)`,
                    }}
                  >
                    {/* Rarity accent line */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{
                        background: rarityLineColor,
                      }}
                    />
                    
                    <div className="grid grid-cols-[110px_1fr] gap-3 items-start relative">
                      <div className="flex items-start justify-center relative" style={{ marginTop: '-8px' }}>
                        <img
                          src={rod.icon}
                          alt={rod.name}
                          style={{
                            width: 100,
                            height: 'auto',
                            objectFit: 'contain',
                            transform: 'rotate(-12deg)',
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))',
                          }}
                        />
                      </div>
                      <div className="min-w-0 pt-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="m-0 text-base font-black tracking-wide">{rod.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black ${rarityColors.bg} ${rarityColors.text} ${rarityColors.border}`}
                          >
                            {rod.rarity}
                          </span>
                        </div>
                        {rod.dailyYieldPct > 0 && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-2.5">
                            <span className="w-1 h-1 rounded-full bg-sun/60"></span>
                            <span>{(rod.dailyYieldPct * 100).toFixed(1)}% / сутки</span>
                          </div>
                        )}

                        {rod.currency === 'TON' ? (
                          <div className="mb-2.5">
                            <div className="text-xs font-semibold text-muted mb-1.5">
                              <span>Сумма покупки</span>
                            </div>
                            <input
                              type="number"
                              min={rod.minStake}
                              max={rod.maxStake}
                              step={rod.minStake < 1 ? 0.1 : 1}
                              value={stakeAmounts[rod.id] || ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                if (value !== undefined) {
                                  const clamped = Math.max(rod.minStake, Math.min(rod.maxStake, value));
                                  setStakeAmounts({ ...stakeAmounts, [rod.id]: clamped });
                                } else {
                                  const newAmounts = { ...stakeAmounts };
                                  delete newAmounts[rod.id];
                                  setStakeAmounts(newAmounts);
                                }
                              }}
                              className="w-full px-2.5 py-2 rounded-[14px] bg-white/45 border border-white/70 font-medium text-ink text-sm focus:outline-none focus:ring-2 focus:ring-sun/50 placeholder:text-muted"
                              placeholder={`${rod.minStake}–${rod.maxStake} TON`}
                            />
                          </div>
                        ) : (
                          <div className="mb-2.5 px-2.5 py-2 rounded-[14px] bg-white/45 border border-white/70">
                            <div className="flex justify-between items-center text-sm font-medium text-muted">
                              <span>Цена</span>
                              <span className="text-ink">{rod.priceFish} FISH</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2.5 items-center justify-between">
                          {owned && (
                            <button
                              className="px-3.5 py-2.5 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-semibold cursor-pointer text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                              onClick={() => {
                                triggerHaptic('light');
                                equipRod(rod.id);
                              }}
                              onMouseDown={() => triggerHaptic('light')}
                            >
                              {equipped ? 'Активна' : 'Экипировать'}
                            </button>
                          )}
                          <button
                            className="game-button w-auto min-w-[160px] px-3.5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => {
                              triggerHaptic('medium');
                              handleBuy(rod.id);
                            }}
                            onMouseDown={() => triggerHaptic('light')}
                          >
                            {owned ? 'Купить ещё' : 'Купить'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="game-card mb-2.5">
                <div className="font-black">Мои удочки</div>
                <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                  Экипируй одну и запускай сессию на озере.
                </div>
              </div>
              <div className="grid gap-2.5">
                {ownedRods.map((rodId) => {
                  const rod = rods.find((r) => r.id === rodId);
                  if (!rod) return null;
                  return (
                    <div key={rodId} className="game-card">
                      <div className="flex justify-between items-center gap-2.5">
                        <div className="flex gap-2.5 items-center min-w-0">
                          <div className="w-[46px] h-[46px] rounded-2xl bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center">
                            <img
                              src={rod.icon}
                              alt={rod.name}
                              style={{ width: 32, height: 32, objectFit: 'contain' }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black">{rod.name}</div>
                            <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5 flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-black ${getRarityColors(rod.rarity).bg} ${getRarityColors(rod.rarity).text} ${getRarityColors(rod.rarity).border}`}
                              >
                                {rod.rarity}
                              </span>
                              <span>•</span>
                              <span>
                                {rod.currency === 'TON'
                                  ? `${rod.minStake}–${rod.maxStake} TON`
                                  : `${rod.priceFish} FISH`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
                          onClick={() => {
                            triggerHaptic('light');
                            equipRod(rodId);
                          }}
                          onMouseDown={() => triggerHaptic('light')}
                        >
                          {equippedRodId === rodId ? 'Активна' : 'Экипировать'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="game-card mt-2.5">
                <div className="font-black">Мои предметы</div>
                <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                  {inventory.length === 0 ? 'Пока пусто.' : ''}
                </div>
              </div>
              <div className="grid gap-2.5 mt-2.5">
                {inventory.map((item) => (
                  <div key={item.id} className="game-card">
                    <div className="flex justify-between items-center gap-2.5">
                      <div className="flex gap-2.5 items-center min-w-0">
                        <div className="w-[46px] h-[46px] rounded-2xl bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center">
                          <img
                            src={item.icon}
                            alt={item.name}
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black">{item.name}</div>
                          <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                            {item.type === 'fish' ? 'Рыба' : 'Барахло'} •{' '}
                            {item.payoutTon > 0
                              ? `${formatTon(item.payoutTon)} TON`
                              : `${formatFish(item.payoutFish)} FISH`}
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
                        onClick={() => {
                          triggerHaptic('light');
                          listItem(item.id);
                        }}
                        onMouseDown={() => triggerHaptic('light')}
                      >
                        На рынок
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

