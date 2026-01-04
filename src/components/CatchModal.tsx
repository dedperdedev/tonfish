import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';
import type { CatchResult } from '../types';

interface CatchModalProps {
  catchResult: CatchResult | null;
  onClose: () => void;
}

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

export function CatchModal({ catchResult, onClose }: CatchModalProps) {
  const navigate = useNavigate();
  const addToInventory = useGameStore((s) => s.addToInventory);

  if (!catchResult) return null;

  const handleSell = () => {
    // Add directly to market.listed (bypass inventory)
    useGameStore.setState((state) => ({
      market: {
        ...state.market,
        listed: [...state.market.listed, { ...catchResult, status: 'in_inventory' as const }],
      },
    }));
    navigate('/market');
    onClose();
  };

  const handleKeep = () => {
    // Just add to inventory
    addToInventory(catchResult);
    navigate('/shop');
    onClose();
  };

  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.28)] flex items-center justify-center z-20 p-4.5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[32px] glass-card shadow-[0_28px_80px_rgba(0,30,45,.35)] overflow-hidden animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4.5 pb-0">
          <h2 className="m-0 text-lg font-black font-heading">Улов!</h2>
          <p className="mt-1.5 mb-0 text-muted font-extrabold text-xs">
            Продать или оставить?
          </p>
        </div>
        <div className="mx-3.5 my-3.5 rounded-2xl bg-gradient-to-b from-aqua/28 to-sun/18 border border-white/90 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] h-[180px] grid place-items-center relative overflow-hidden">
          <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.75),rgba(255,255,255,0)_60%)] rotate-[18deg]"></div>
          <div className="text-[78px] drop-shadow-[0_14px_18px_rgba(0,0,0,.18)] z-[2] translate-y-1">
            {getEmoji(catchResult.name)}
          </div>
        </div>
        <div className="px-4.5 pb-4.5 grid gap-2.5">
          <div className="flex items-baseline justify-between px-3.5 py-3 rounded-[18px] glass-card">
            <div>
              <div className="text-lg font-black">{catchResult.name}</div>
              <div className="text-xs font-black text-muted">
                {catchResult.type === 'fish' ? 'Рыба' : 'Барахло'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black">
                {catchResult.payoutTon > 0
                  ? `${formatTon(catchResult.payoutTon)} TON`
                  : '—'}
              </div>
              <div className="text-xs font-black text-muted">
                ≈ {formatFish(catchResult.payoutFish)} FISH
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button className="game-button text-sm py-3.5 px-3.5" onClick={handleSell}>
              Продать
            </button>
            <button
              className="w-full px-3.5 py-3.5 rounded-[18px] border border-white/92 bg-white/62 font-black cursor-pointer shadow-game-sm"
              onClick={handleKeep}
            >
              Оставить
            </button>
          </div>
          <button
            className="w-full px-3.5 py-3.5 rounded-[18px] border border-white/92 bg-white/62 font-black cursor-pointer shadow-game-sm"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

