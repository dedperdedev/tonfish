import { useState } from 'react';
import { useGameStore, rods } from '../store/gameStore';
import { Hud } from '../components/Hud';
import { VideoBackground } from '../components/VideoBackground';
import { formatTon, formatFish } from '../utils/formatters';
import { getRarityColors } from '../utils/rarity';

const rodIcons: Record<string, string> = {
  stick: '🪵',
  reed: '🌾',
  bamboo: '🎋',
  telescopic: '📏',
  spinning: '🎣',
  feeder: '🧺',
  boom: '💥',
};

const emojiMap: Record<string, string> = {
  Головастик: '🐸',
  Лягушка: '🐸',
  Бычок: '🐟',
  Карась: '🐟',
  Окунь: '🐟',
  Щука: '🐟',
  Судак: '🐟',
  Карп: '🐟',
  Амур: '🐟',
  Акула: '🦈',
  'Консервная банка': '🥫',
  Сапог: '👢',
  'Старая блесна': '🪝',
  'Ржавая цепь': '⛓️',
  Тина: '🪸',
  Ил: '🟫',
  Пакет: '🛍️',
  'Якорь-брелок': '⚓',
  Сундук: '🧰',
  Кость: '🦴',
};

function getEmoji(name: string): string {
  return emojiMap[name] || '🎁';
}

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
        ? stakeAmounts[rodId] ||
          Math.max(rod.minStake, Math.min(rod.maxStake, rod.minStake + (rod.maxStake - rod.minStake) * 0.55))
        : rod.priceFish || rod.minStake;

    if (buyRod(rodId, stake)) {
      // Success handled by store
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <VideoBackground opacity={0.25} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <div className="relative z-[3] flex gap-2.5 items-center justify-between mt-1.5 mb-2.5">
          <h1 className="m-0 text-xl font-black tracking-wide font-heading">Магазин</h1>
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

        <Hud />

        <div className="relative z-[3] flex-1 overflow-auto pb-3 -webkit-overflow-scrolling-touch">
          {tab === 'shop' ? (
            <div className="grid gap-2.5">
              {rods.map((rod) => {
                const owned = ownedRods.includes(rod.id);
                const equipped = equippedRodId === rod.id;
                const stake =
                  stakeAmounts[rod.id] ||
                  (rod.currency === 'TON'
                    ? Math.max(rod.minStake, Math.min(rod.maxStake, rod.minStake + (rod.maxStake - rod.minStake) * 0.55))
                    : rod.priceFish || rod.minStake);

                return (
                  <div key={rod.id} className="game-card">
                    <div className="grid grid-cols-[54px_1fr] gap-3 items-start">
                      <div className="w-[54px] h-[54px] rounded-[18px] bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center relative overflow-hidden">
                        <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.65),rgba(255,255,255,0)_55%)] rotate-[18deg]"></div>
                        <span className="text-2xl z-[2]">{rodIcons[rod.id] || '🎣'}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="m-0 text-base font-black tracking-wide">{rod.name}</h3>
                        <div className="mt-0.5 flex gap-2 flex-wrap items-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-black ${getRarityColors(rod.rarity).bg} ${getRarityColors(rod.rarity).text} ${getRarityColors(rod.rarity).border}`}
                          >
                            {rod.rarity}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                            <strong className="text-ink">{rod.currency}</strong>{' '}
                            {rod.currency === 'TON' ? `${rod.minStake}–${rod.maxStake}` : `${rod.priceFish}`}
                          </span>
                          {rod.dailyYieldPct > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                              <strong className="text-ink">
                                {(rod.dailyYieldPct * 100).toFixed(1)}%/сутки
                              </strong>
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                          Лут: {rod.loot.join(' / ')}
                        </div>

                        {rod.currency === 'TON' ? (
                          <div className="mt-2.5 px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85">
                            <div className="flex justify-between items-center font-black text-xs text-muted mb-2.5">
                              <span>Сумма</span>
                              <b className="text-ink">
                                {formatTon(stake)} TON
                              </b>
                            </div>
                            <input
                              type="range"
                              min={rod.minStake}
                              max={rod.maxStake}
                              step={rod.minStake < 1 ? 0.1 : 1}
                              value={stake}
                              onChange={(e) =>
                                setStakeAmounts({ ...stakeAmounts, [rod.id]: parseFloat(e.target.value) })
                              }
                              className="w-full accent-[#ffb23b]"
                            />
                          </div>
                        ) : (
                          <div className="mt-2.5 px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85">
                            <div className="flex justify-between items-center font-black text-xs text-muted">
                              <span>Цена</span>
                              <b className="text-ink">{rod.priceFish} FISH</b>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2.5 items-center justify-between mt-3">
                          {owned && (
                            <button
                              className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
                              onClick={() => equipRod(rod.id)}
                            >
                              {equipped ? 'Активна' : 'Экипировать'}
                            </button>
                          )}
                          <button
                            className="game-button w-auto min-w-[140px] px-3.5 py-3 text-sm"
                            onClick={() => handleBuy(rod.id)}
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
                            {rodIcons[rod.id] || '🎣'}
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
                          onClick={() => equipRod(rodId)}
                        >
                          {equippedRodId === rodId ? 'Активна' : 'Экипировать'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="game-card mt-3">
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
                          {getEmoji(item.name)}
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
                        onClick={() => listItem(item.id)}
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

