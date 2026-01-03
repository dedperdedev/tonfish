import { useGameStore } from '../store/gameStore';
import { formatTime } from '../utils/session';
import { rods } from '../store/gameStore';

interface BottomPanelProps {
  onStartClick: () => void;
  onOpenFishing: () => void;
}

export function BottomPanel({ onStartClick, onOpenFishing }: BottomPanelProps) {
  const equippedRodId = useGameStore((s) => s.equippedRodId);
  const session = useGameStore((s) => s.getNormalizedSession());
  const fastForwardSession = useGameStore((s) => s.fastForwardSession);

  const equippedRod = equippedRodId ? rods.find((r) => r.id === equippedRodId) : null;

  let title = 'Нет удочки';
  let subtitle = 'Зайди в магазин и выбери свою.';
  let buttonText = 'Выбрать удочку';
  let pulse = false;

  if (!equippedRod) {
    // No rod
  } else if (!session) {
    title = 'Удочка готова';
    subtitle = `${equippedRod.name} • ${
      equippedRod.currency === 'TON'
        ? `${equippedRod.minStake}–${equippedRod.maxStake} TON`
        : `${equippedRod.priceFish} FISH`
    }`;
    buttonText = 'Начать рыбалку';
  } else if (session.status === 'running') {
    title = 'Рыбалка идёт';
    const remaining = session.endAt - Date.now();
    subtitle = `Осталось: ${formatTime(remaining)}`;
    buttonText = 'Открыть рыбалку';
  } else if (session.status === 'ready') {
    title = 'Улов готов';
    subtitle = 'Забери трофей и реши, что делать.';
    buttonText = 'Забрать улов';
    pulse = true;
  }

  const handleClick = () => {
    if (!equippedRod) {
      onStartClick();
    } else if (!session) {
      onStartClick();
    } else if (session.status === 'running') {
      onOpenFishing();
    } else if (session.status === 'ready') {
      // Will be handled by parent
      onStartClick();
    }
  };

  return (
    <div className="absolute left-3.5 right-3.5 bottom-[calc(var(--safe-bottom)+84px)] z-[4] p-3.5">
      <div className="glass-card rounded-xl shadow-game p-3.5">
        <div className="flex gap-2.5 items-center justify-between mb-2.5">
          <div className="min-w-0">
            <div className="font-black tracking-wide">{title}</div>
            <div className="text-xs font-extrabold text-muted">{subtitle}</div>
          </div>
          {session && session.status === 'running' && (
            <button
              className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
              onClick={fastForwardSession}
              title="Dev: Завершить сессию"
            >
              ⚡
            </button>
          )}
        </div>
        <button
          className={`game-button ${pulse ? 'pulse' : ''}`}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

