import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, rods } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { triggerHaptic } from '../utils/haptics';
import { playZakid } from '../utils/sound';
import { Fish } from 'lucide-react';
import { TonIcon } from '../components/TonIcon';

const SELL_DURATION_MS = 60 * 60 * 1000; // 1 час

export function ShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'shop' | 'inv' | 'market'>('shop');
  const ownedRods = useGameStore((s) => s.ownedRods);
  const inventory = useGameStore((s) => s.inventory);
  const buyRod = useGameStore((s) => s.buyRod);
  const listItem = useGameStore((s) => s.listItem);
  const listed = useGameStore((s) => s.market.listed);
  const sellItem = useGameStore((s) => s.sellItem);
  const equipRod = useGameStore((s) => s.equipRod);
  const startFishing = useGameStore((s) => s.startFishing);

  // Автозавершение продажи через 1ч
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      listed.forEach((item) => {
        const listedAt = item.listedAt ?? now - SELL_DURATION_MS;
        if (now - listedAt >= SELL_DURATION_MS) {
          sellItem(item.id);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [listed, sellItem]);

  const handleBuy = (rodId: string) => {
    const rod = rods.find((r) => r.id === rodId);
    if (!rod) return;

    const stake =
      rod.currency === 'TON' || rod.currency === 'STARS'
        ? rod.minStake
        : rod.priceFish ?? rod.minStake;

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
            <div className="grid grid-cols-2 gap-3">
              {listed.length === 0 ? (
                <div className="col-span-2 rounded-2xl glass-card p-5">
                  <div className="font-black">Пока пусто</div>
                  <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                    Поймай улов и выставь на продажу.
                  </div>
                </div>
              ) : (
                listed.map((item) => {
                  const listedAt = item.listedAt ?? 0;
                  const remaining = listedAt > 0 ? Math.max(0, listedAt + SELL_DURATION_MS - Date.now()) : 0;
                  const selling = remaining > 0;
                  const minsLeft = Math.ceil(remaining / 60000);
                  return (
                    <div
                      key={item.id}
                      className="relative flex flex-col rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(156, 163, 175, 0.25)',
                        backdropFilter: 'blur(18px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="absolute top-2 left-2 z-[2]">
                        <span className="text-[11px] font-black text-ink">{item.name}</span>
                      </div>
                      <div className="flex items-center justify-center p-3 pt-8 pb-2" style={{ minHeight: '100px' }}>
                        <img
                          src={import.meta.env.DEV ? item.icon : `${import.meta.env.BASE_URL}${item.icon.replace(/^\//, '')}`}
                          alt=""
                          className="w-[85%] max-h-20 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="text-center text-xs font-bold text-muted px-2 pb-1">
                        {selling ? `Продаётся · ${minsLeft} мин` : 'Продано'}
                      </div>
                      <button
                        className="w-full py-2.5 text-sm font-black border-0 cursor-pointer opacity-50"
                        style={{ background: 'rgba(0,0,0,0.1)' }}
                        disabled
                        title={selling ? `Осталось ${minsLeft} мин` : 'Продано'}
                      >
                        Продать
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : tab === 'shop' ? (
            <div className="grid grid-cols-2 gap-3">
              {rods.map((rod) => {
                const owned = ownedRods.includes(rod.id);

                const glassTintMap: Record<string, string> = {
                  Common: 'rgba(156, 163, 175, 0.32)',
                  Uncommon: 'rgba(34, 197, 94, 0.28)',
                  Rare: 'rgba(59, 130, 246, 0.28)',
                  Epic: 'rgba(168, 85, 247, 0.28)',
                  Legendary: 'rgba(251, 191, 36, 0.28)',
                  Mythic: 'rgba(236, 72, 153, 0.28)',
                  Apex: 'rgba(239, 68, 68, 0.3)',
                };
                const glassTint = glassTintMap[rod.rarity] || 'rgba(156, 163, 175, 0.25)';

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
                  ? `До ${(rod.dailyYieldPct * 100 * 365).toFixed(1)}%`
                  : '';

                const priceDisplay = rod.currency === 'TON'
                  ? `${rod.minStake}${rod.maxStake !== rod.minStake ? '–' + rod.maxStake : ''}`
                  : rod.currency === 'STARS'
                    ? `${rod.minStake}–${rod.maxStake}`
                    : `${rod.priceFish}`;
                const priceCurrency = rod.currency === 'TON' ? 'TON' : rod.currency === 'STARS' ? 'звёзд' : 'FISH';

                return (
                  <div key={rod.id} className="flex flex-col">
                    <div
                      className="relative rounded-2xl overflow-hidden"
                      style={{
                        background: glassTint,
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      {roiPercent && (
                        <div
                          className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-black text-white rounded-bl-xl z-[2]"
                          style={{ background: roiBg }}
                        >
                          {roiPercent}
                        </div>
                      )}

                      <div className="absolute top-2 left-2 z-[2]">
                        <span className="text-sm font-black text-ink tracking-wide">{rod.name}</span>
                      </div>

                      <div className="flex items-center justify-center p-3 pt-8 pb-2" style={{ minHeight: '140px' }}>
                        <img
                          src={import.meta.env.DEV ? rod.icon : `${import.meta.env.BASE_URL}${rod.icon.replace(/^\//, '')}`}
                          alt={rod.name}
                          style={{
                            width: '85%',
                            maxHeight: 120,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-center gap-1.5 pb-2">
                        {rod.currency === 'TON' && <TonIcon className="w-4 h-4 text-blue-500" />}
                        {rod.currency === 'FISH' && <Fish size={16} strokeWidth={2.5} className="text-amber-500" />}
                        {rod.currency === 'STARS' && <span className="text-amber-400 text-sm">★</span>}
                        <span className="text-sm font-black">{priceDisplay}</span>
                        <span className="text-[10px] font-bold text-muted">{priceCurrency}</span>
                        {owned && <span className="text-[9px] font-bold text-green-600 ml-0.5">✓</span>}
                      </div>

                      <button
                        className="w-full py-2.5 text-sm font-black cursor-pointer transition-all hover:brightness-110 active:scale-[0.97] border-0"
                        style={{ background: 'rgba(0,0,0,0.15)', color: 'inherit' }}
                        onClick={() => { triggerHaptic('medium'); handleBuy(rod.id); }}
                        onMouseDown={() => triggerHaptic('light')}
                      >
                        {owned ? 'Купить ещё' : 'Купить'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {/* Удочки: квадратные карточки, количество, Закинуть → 24ч */}
              {(() => {
                const rodCounts = ownedRods.reduce((acc, id) => {
                  acc[id] = (acc[id] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                const rodEntries = Object.entries(rodCounts);
                const glassTint = 'rgba(156, 163, 175, 0.28)';
                return rodEntries.length === 0 ? null : (
                  <div className="grid grid-cols-2 gap-3">
                    {rodEntries.map(([rodId, count]) => {
                      const rod = rods.find((r) => r.id === rodId);
                      if (!rod) return null;
                      const stake = rod.currency === 'TON' || rod.currency === 'STARS' ? rod.minStake : (rod.priceFish ?? rod.minStake);
                      return (
                        <div key={rodId} className="relative flex flex-col rounded-2xl overflow-hidden" style={{ background: glassTint, backdropFilter: 'blur(18px)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                          <div className="absolute top-2 left-2 z-[2]">
                            <span className="text-sm font-black text-ink">{rod.name}</span>
                            <span className="text-xs font-bold text-muted ml-1">({count} шт)</span>
                          </div>
                          <div className="flex items-center justify-center p-3 pt-8 pb-2" style={{ minHeight: '100px' }}>
                            <img src={import.meta.env.DEV ? rod.icon : `${import.meta.env.BASE_URL}${rod.icon.replace(/^\//, '')}`} alt="" className="w-[85%] max-h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <button
                            className="w-full py-2.5 text-sm font-black border-0 cursor-pointer transition-all hover:brightness-110 active:scale-[0.97]"
                            style={{ background: 'rgba(0,0,0,0.15)' }}
                            onClick={() => {
                              triggerHaptic('medium');
                              playZakid();
                              equipRod(rodId);
                              startFishing(rodId, stake);
                              navigate('/lake');
                            }}
                            onMouseDown={() => triggerHaptic('light')}
                          >
                            Закинуть
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Предметы (улов): квадратные карточки, количество, На рынок */}
              {inventory.length === 0 ? (
                <div className="rounded-2xl glass-card p-5 mt-3">
                  <div className="font-black">Мои предметы</div>
                  <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">Пока пусто.</div>
                </div>
              ) : (
                (() => {
                  const byItemId = inventory.reduce((acc, item) => {
                    const k = item.itemId;
                    if (!acc[k]) acc[k] = [];
                    acc[k].push(item);
                    return acc;
                  }, {} as Record<string, typeof inventory>);
                  const groups = Object.entries(byItemId);
                  return (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {groups.map(([itemId, items]) => {
                        const first = items[0]!;
                        const count = items.length;
                        return (
                          <div key={itemId} className="relative flex flex-col rounded-2xl overflow-hidden" style={{ background: 'rgba(156, 163, 175, 0.25)', backdropFilter: 'blur(18px)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div className="absolute top-2 left-2 z-[2]">
                              <span className="text-sm font-black text-ink">{first.name}</span>
                              <span className="text-xs font-bold text-muted ml-1">({count} шт)</span>
                            </div>
                            <div className="flex items-center justify-center p-3 pt-8 pb-2" style={{ minHeight: '100px' }}>
                              <img src={import.meta.env.DEV ? first.icon : `${import.meta.env.BASE_URL}${first.icon.replace(/^\//, '')}`} alt="" className="w-[85%] max-h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <button
                              className="w-full py-2.5 text-sm font-black border-0 cursor-pointer glass-button"
                              style={{ background: 'rgba(0,0,0,0.15)' }}
                              onClick={() => { triggerHaptic('light'); listItem(first.id); }}
                              onMouseDown={() => triggerHaptic('light')}
                            >
                              На рынок
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

