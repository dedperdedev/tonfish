import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { formatTon } from '../utils/formatters';
import { triggerHaptic } from '../utils/haptics';
import { Trophy, Ticket, Info, Minus, Plus, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { TonIcon } from '../components/TonIcon';

const TICKET_PRICE = 0.01; // TON
const PRIZE_POOL = 100; // TON
/** Конец лотереи: через 7 дней от текущей даты (для примера; можно заменить на фиксированную дату) */
const getRaffleEndMs = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};
const RAFFLE_END_MS = getRaffleEndMs();

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '0д 00:00:00';
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000) % 24;
  const d = Math.floor(ms / 86400000);
  return `${d}д ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Мок-данные лидерборда */
const MOCK_LEADERBOARD = [
  { name: 'CryptoWhale', tickets: 312 },
  { name: 'FishKing99', tickets: 187 },
  { name: 'TonMaster', tickets: 145 },
  { name: 'LuckyFisher', tickets: 98 },
  { name: 'DeepSea007', tickets: 76 },
  { name: 'WaveCatcher', tickets: 54 },
  { name: 'GoldFish_X', tickets: 41 },
  { name: 'NetRunner', tickets: 33 },
  { name: 'Rybak2026', tickets: 21 },
  { name: 'AquaHunter', tickets: 14 },
];

export function RafflePage() {
  const balances = useGameStore((s) => s.balances);
  const [ticketCount, setTicketCount] = useState(1);
  const [myTickets, setMyTickets] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, RAFFLE_END_MS - Date.now()));

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(() => Math.max(0, RAFFLE_END_MS - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const totalCost = +(ticketCount * TICKET_PRICE).toFixed(4);
  const canAfford = balances.ton >= totalCost;

  const totalTicketsSold = MOCK_LEADERBOARD.reduce((sum, p) => sum + p.tickets, 0) + myTickets;
  const myChance = myTickets > 0 ? ((myTickets / totalTicketsSold) * 100).toFixed(1) : '0';

  const handleBuy = () => {
    if (!canAfford) return;
    triggerHaptic('success');
    useGameStore.setState((state) => ({
      balances: { ...state.balances, ton: +(state.balances.ton - totalCost).toFixed(4) },
    }));
    setMyTickets((prev) => prev + ticketCount);
    setTicketCount(1);
  };

  const decrement = () => setTicketCount((c) => Math.max(1, c - 1));
  const increment = () => setTicketCount((c) => c + 1);

  return (
    <div className="relative h-full w-full">
      <LakeBackground opacity={0.2} />

      <div className="absolute inset-0 flex flex-col pr-2 pb-[calc(var(--safe-bottom)+0px)] pl-2 overflow-hidden" style={{ margin: 0, border: 0, paddingTop: '5px' }}>
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pb-24 -webkit-overflow-scrolling-touch">
          {/* Prize pool */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.15))',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy size={24} strokeWidth={2.5} className="text-amber-500" />
              <p className="text-muted font-extrabold text-xs">Призовой фонд</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TonIcon className="w-9 h-9 text-blue-500" />
              <span className="text-4xl font-black tracking-wide">{PRIZE_POOL}</span>
              <span className="text-xl font-extrabold text-muted">TON</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-2">
              <Clock size={18} strokeWidth={2.5} className="text-muted" />
              <span className="text-sm font-bold text-muted">До конца лотереи:</span>
              <span className="text-lg font-black text-ink tabular-nums">{formatTimeLeft(timeLeft)}</span>
            </div>
          </div>

          {/* My tickets & chance */}
          {myTickets > 0 && (
            <div className="mt-3 rounded-2xl glass-surface p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-muted">Мои билеты</p>
                <p className="text-lg font-black">{myTickets}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-muted">Мой шанс</p>
                <p className="text-lg font-black text-green-600">{myChance}%</p>
              </div>
            </div>
          )}

          {/* Buy tickets */}
          <div className="mt-4">
            <p className="text-muted font-extrabold text-xs mb-2 flex items-center gap-1.5">
              <Ticket size={14} strokeWidth={2.5} />
              Купить билеты
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="glass-button w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                onClick={decrement}
                onMouseDown={() => triggerHaptic('light')}
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-black">{ticketCount}</span>
                <p className="text-xs font-extrabold text-muted mt-0.5">
                  = {formatTon(totalCost)} TON
                </p>
              </div>
              <button
                type="button"
                className="glass-button w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
                onClick={increment}
                onMouseDown={() => triggerHaptic('light')}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
            <button
              type="button"
              className={`game-button mt-3 flex items-center justify-center gap-2 ${!canAfford ? 'opacity-50' : ''}`}
              disabled={!canAfford}
              onClick={handleBuy}
              onMouseDown={() => triggerHaptic('light')}
            >
              <Ticket size={20} strokeWidth={2.5} />
              {canAfford
                ? `Купить ${ticketCount} билет${ticketCount > 1 ? (ticketCount < 5 ? 'а' : 'ов') : ''}`
                : 'Недостаточно TON'}
            </button>
            <p className="text-center text-[11px] text-muted font-bold mt-1.5">
              1 билет = {TICKET_PRICE} TON
            </p>
          </div>

          {/* Leaderboard */}
          <div className="mt-4">
            <p className="text-muted font-extrabold text-xs mb-2">Рейтинг игроков</p>
            <div className="rounded-2xl glass-surface overflow-hidden">
              {myTickets > 0 && (
                <div
                  className="flex items-center justify-between px-3 py-2.5 font-bold text-sm"
                  style={{ background: 'rgba(59, 130, 246, 0.15)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center font-black text-blue-600">—</span>
                    <span className="font-extrabold">Вы</span>
                  </div>
                  <span className="font-black">{myTickets} бил.</span>
                </div>
              )}
              {MOCK_LEADERBOARD.map((player, i) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between px-3 py-2 text-sm ${
                    i < MOCK_LEADERBOARD.length - 1 ? 'border-b border-white/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-6 text-center font-black ${
                      i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-muted'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-extrabold">{player.name}</span>
                  </div>
                  <span className="font-bold text-muted">{player.tickets} бил.</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="mt-4 mb-2">
            <button
              type="button"
              className="w-full flex items-center justify-between text-left glass-button px-4 py-3 rounded-2xl font-bold cursor-pointer text-sm"
              onClick={() => setShowRules(!showRules)}
              onMouseDown={() => triggerHaptic('light')}
            >
              <span className="flex items-center gap-1.5">
                <Info size={16} strokeWidth={2.5} />
                Как это работает?
              </span>
              {showRules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showRules && (
              <div className="mt-2 rounded-2xl glass-surface p-4 text-sm leading-relaxed">
                <ul className="list-none m-0 p-0 space-y-2.5">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0">1.</span>
                    <span>
                      <b>Покупайте билеты</b> — каждый билет стоит {TICKET_PRICE} TON.
                      Количество билетов не ограничено.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0">2.</span>
                    <span>
                      <b>Чем больше билетов — тем выше шанс.</b> Ваша доля в призовом фонде
                      пропорциональна количеству купленных билетов по сравнению
                      с остальными участниками.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0">3.</span>
                    <span>
                      <b>Призовой фонд {PRIZE_POOL} TON</b> распределяется между
                      победителями. Чем выше ваш рейтинг — тем больше доля приза.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0">4.</span>
                    <span>
                      <b>Рейтинг обновляется</b> в реальном времени. Следите за своей
                      позицией и докупайте билеты, чтобы увеличить шансы.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
