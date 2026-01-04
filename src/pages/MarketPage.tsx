import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { formatTon, formatFish } from '../utils/formatters';
import { triggerHaptic } from '../utils/haptics';

export function MarketPage() {
  const [tab, setTab] = useState<'sell' | 'hist'>('sell');
  const listed = useGameStore((s) => s.market.listed);
  const history = useGameStore((s) => s.market.history);
  const sellItem = useGameStore((s) => s.sellItem);

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <LakeBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />
        
        <div className="relative z-[3] flex justify-center mb-2.5">
          <div className="inline-flex gap-1.5 p-1.5 rounded-2xl glass-card">
            <button
              className={`border-0 rounded-2xl px-3 py-2.5 font-bold bg-transparent cursor-pointer transition-all ${
                tab === 'sell'
                  ? 'bg-white/40 text-ink'
                  : 'text-muted'
              }`}
              onClick={() => setTab('sell')}
            >
              Продать
            </button>
            <button
              className={`border-0 rounded-2xl px-3 py-2.5 font-bold bg-transparent cursor-pointer transition-all ${
                tab === 'hist'
                  ? 'bg-white/40 text-ink'
                  : 'text-muted'
              }`}
              onClick={() => setTab('hist')}
            >
              История
            </button>
          </div>
        </div>

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
          {tab === 'sell' ? (
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
                        className="game-button w-auto min-w-[120px] px-4 py-2.5 rounded-2xl text-sm"
                        onClick={() => {
                          triggerHaptic('success');
                          sellItem(item.id);
                        }}
                        onMouseDown={() => triggerHaptic('light')}
                      >
                        Продать
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-2.5">
              {history.length === 0 ? (
                <div className="game-card">
                  <div className="font-black">Истории нет</div>
                  <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
                    Продай что-нибудь.
                  </div>
                </div>
              ) : (
                [...history].reverse().map((item) => {
                  const date = new Date(item.soldAt || item.createdAt);
                  return (
                    <div key={item.id} className="game-card">
                      <div className="flex justify-between items-center gap-2.5">
                        <div className="flex gap-2.5 items-center min-w-0">
                          <div className="w-[46px] h-[46px] rounded-2xl glass-surface grid place-items-center">
                            <img
                              src={item.icon}
                              alt={item.name}
                              style={{ width: 32, height: 32, objectFit: 'contain' }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black">{item.name}</div>
                            <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                              {date.toLocaleString('ru-RU')} • +{' '}
                              {item.payoutTon > 0
                                ? `${formatTon(item.payoutTon)} TON`
                                : `${formatFish(item.payoutFish)} FISH`}
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-surface text-xs font-bold text-muted">
                          продано
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

