import { useState } from 'react';
import { useGameStore, rods } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { formatTon, formatFish } from '../utils/formatters';
import { getRarityColors } from '../utils/rarity';
import { triggerHaptic } from '../utils/haptics';
import { Coins, Fish } from 'lucide-react';
import { TonIcon } from '../components/TonIcon';

export function ShopPage() {
  const [tab, setTab] = useState<'shop' | 'inv' | 'market'>('shop');
  const ownedRods = useGameStore((s) => s.ownedRods);
  const inventory = useGameStore((s) => s.inventory);
  const buyRod = useGameStore((s) => s.buyRod);
  const listItem = useGameStore((s) => s.listItem);
  const listed = useGameStore((s) => s.market.listed);
  const sellItem = useGameStore((s) => s.sellItem);

  const handleBuy = (rodId: string) => {
    const rod = rods.find((r) => r.id === rodId);
    if (!rod) return;

    const stake =
      rod.currency === 'TON'
        ? rod.minStake
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
            <div className="inline-flex gap-1.5 p-1.5 rounded-2xl glass-card">
              <button
                className={`border-0 rounded-2xl px-3 py-2.5 font-bold bg-transparent cursor-pointer transition-all ${
                  tab === 'shop'
                    ? 'bg-white/40 text-ink'
                    : 'text-muted'
                }`}
                onClick={() => setTab('shop')}
              >
                Магазин
              </button>
              <button
                className={`border-0 rounded-2xl px-3 py-2.5 font-bold bg-transparent cursor-pointer transition-all ${
                  tab === 'inv'
                    ? 'bg-white/40 text-ink'
                    : 'text-muted'
                }`}
                onClick={() => setTab('inv')}
              >
                Инвентарь
              </button>
              <button
                className={`border-0 rounded-2xl px-3 py-2.5 font-bold bg-transparent cursor-pointer transition-all ${
                  tab === 'market'
                    ? 'bg-white/40 text-ink'
                    : 'text-muted'
                }`}
                onClick={() => setTab('market')}
              >
                Рынок
              </button>
            </div>
          </div>
          {tab === 'market' ? (
            <div className="grid gap-2.5">
              {listed.length === 0 ? (
                <div className="game-card">
                  <div className="font-black">Пока пусто</div>
                  <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                    Поймай улов и выставь на продажу.
                  </div>
                </div>
              ) : (
                listed.map((item) => (
                  <div key={item.id} className="game-card">
                    <div className="flex justify-between items-center gap-2.5">
                      <div className="flex gap-2.5 items-center min-w-0">
                        <div className="w-[46px] h-[46px] rounded-2xl glass-surface grid place-items-center">
                          <img
                            src={import.meta.env.DEV ? item.icon : `${import.meta.env.BASE_URL}${item.icon.replace(/^\//, '')}`}
                            alt={item.name}
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
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
                        className="glass-button w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.05] active:scale-[0.95]"
                        onClick={() => {
                          triggerHaptic('success');
                          sellItem(item.id);
                        }}
                        onMouseDown={() => triggerHaptic('light')}
                        title="Продать"
                      >
                        <Coins size={20} className="text-ink" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : tab === 'shop' ? (
            <div className="grid grid-cols-2 gap-3">
              {rods.map((rod) => {
                const owned = ownedRods.includes(rod.id);
                const rarityColors = getRarityColors(rod.rarity);

                // Dark card bg per rarity
                const rarityBgMap: Record<string, string> = {
                  Common: '#2a2e35',
                  Uncommon: '#1e2e24',
                  Rare: '#1a2538',
                  Epic: '#261a38',
                  Legendary: '#332a14',
                  Mythic: '#31182a',
                  Apex: '#351a1a',
                };
                const cardBg = rarityBgMap[rod.rarity] || '#2a2e35';

                // ROI badge color
                const roiBgMap: Record<string, string> = {
                  Common: '#6b7280',
                  Uncommon: '#22c55e',
                  Rare: '#3b82f6',
                  Epic: '#a855f7',
                  Legendary: '#f59e0b',
                  Mythic: '#ec4899',
                  Apex: '#ef4444',
                };
                const roiBg = roiBgMap[rod.rarity] || '#6b7280';

                const roiPercent = rod.dailyYieldPct > 0
                  ? `ROI ${(rod.dailyYieldPct * 100 * 365).toFixed(0)}%`
                  : '';

                const priceDisplay = rod.currency === 'TON'
                  ? `${rod.minStake}${rod.maxStake !== rod.minStake ? '–' + rod.maxStake : ''}`
                  : `${rod.priceFish}`;
                const priceCurrency = rod.currency === 'TON' ? 'TON' : 'FISH';

                return (
                  <div key={rod.id} className="flex flex-col">
                    {/* Card */}
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.97]"
                      style={{ background: cardBg }}
                      onClick={() => {
                        triggerHaptic('medium');
                        handleBuy(rod.id);
                      }}
                    >
                      {/* ROI badge */}
                      {roiPercent && (
                        <div
                          className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-black text-white rounded-bl-xl z-[2]"
                          style={{
                            background: roiBg,
                            transform: 'rotate(0deg)',
                          }}
                        >
                          {roiPercent}
                        </div>
                      )}

                      {/* Rarity badge */}
                      <div className="absolute top-2 left-2 z-[2]">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-black ${rarityColors.bg} ${rarityColors.text} ${rarityColors.border}`}
                        >
                          {rod.rarity}
                        </span>
                      </div>

                      {/* Rod image */}
                      <div className="flex items-center justify-center p-4 pt-8 pb-2" style={{ minHeight: '140px' }}>
                        <img
                          src={import.meta.env.DEV ? rod.icon : `${import.meta.env.BASE_URL}${rod.icon.replace(/^\//, '')}`}
                          alt={rod.name}
                          style={{
                            width: '85%',
                            maxHeight: 120,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Name bar */}
                      <div
                        className="px-3 py-2.5 text-center"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                      >
                        <h3 className="m-0 text-sm font-black text-white tracking-wide uppercase">
                          {rod.name}
                        </h3>
                      </div>
                    </div>

                    {/* Price below card */}
                    <div className="flex items-center justify-center gap-1.5 mt-2 mb-1">
                      {rod.currency === 'TON' ? (
                        <TonIcon className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Fish size={16} strokeWidth={2.5} className="text-amber-400" />
                      )}
                      <span className="text-sm font-black">{priceDisplay}</span>
                      <span className="text-xs font-bold text-muted">{priceCurrency}</span>
                      {owned && (
                        <span className="text-[10px] font-bold text-green-500 ml-1">Есть</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="grid gap-2.5">
                {ownedRods.map((rodId) => {
                  const rod = rods.find((r) => r.id === rodId);
                  if (!rod) return null;
                  return (
                    <div key={rodId} className="game-card">
                      <div className="flex justify-between items-center gap-2.5">
                        <div className="flex gap-2.5 items-center min-w-0">
                          <div className="w-[46px] h-[46px] rounded-2xl glass-surface grid place-items-center">
                            <img
                              src={import.meta.env.DEV ? rod.icon : `${import.meta.env.BASE_URL}${rod.icon.replace(/^\//, '')}`}
                              alt={rod.name}
                              style={{ width: 32, height: 32, objectFit: 'contain' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {inventory.length === 0 ? (
                <div className="game-card mt-2.5">
                  <div className="font-black">Мои предметы</div>
                  <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                    Пока пусто.
                  </div>
                </div>
              ) : (
                <div className="grid gap-2.5 mt-2.5">
                {inventory.map((item) => (
                  <div key={item.id} className="game-card">
                    <div className="flex justify-between items-center gap-2.5">
                      <div className="flex gap-2.5 items-center min-w-0">
                        <div className="w-[46px] h-[46px] rounded-2xl glass-surface grid place-items-center">
                          <img
                            src={import.meta.env.DEV ? item.icon : `${import.meta.env.BASE_URL}${item.icon.replace(/^\//, '')}`}
                            alt={item.name}
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
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
                        className="glass-button px-4 py-2.5 rounded-2xl font-bold cursor-pointer text-sm"
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

