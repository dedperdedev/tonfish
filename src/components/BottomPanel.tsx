import { useGameStore } from '../store/gameStore';
import { formatTime } from '../utils/session';
import { rods } from '../store/gameStore';
import { triggerHaptic } from '../utils/haptics';

interface BottomPanelProps {
  onStartClick: () => void;
  onOpenFishing: () => void;
}

export function BottomPanel({ onStartClick, onOpenFishing }: BottomPanelProps) {
  const equippedRodId = useGameStore((s) => s.equippedRodId);
  const session = useGameStore((s) => s.getNormalizedSession());
  const fastForwardSession = useGameStore((s) => s.fastForwardSession);

  const equippedRod = equippedRodId ? rods.find((r) => r.id === equippedRodId) : null;

  let title = '';
  let subtitle = '';
  let buttonText = '';
  let pulse = false;
  let showCircle = false;

  if (!equippedRod) {
    // No rod - show circle button
    showCircle = true;
    buttonText = 'Выбрать удочку';
  } else if (!session) {
    title = 'Удочка готова';
    subtitle = `${equippedRod.name} • ${
      equippedRod.currency === 'TON'
        ? `${equippedRod.minStake}–${equippedRod.maxStake} TON`
        : `${equippedRod.priceFish} FISH`
    }`;
    buttonText = 'Закинуть';
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
    triggerHaptic('medium');
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

  if (showCircle) {
    return (
      <div className="absolute left-1/2 bottom-[calc(var(--safe-bottom)+84px)] z-[4] transform -translate-x-1/2">
        <button
          className="w-[200px] h-[200px] rounded-full glass-card shadow-game grid place-items-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleClick}
          onMouseDown={() => triggerHaptic('light')}
        >
          <div className="text-center">
            <h2 className="m-0 text-[28px] font-black tracking-wide font-heading">
              {buttonText}
            </h2>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute left-3.5 right-3.5 bottom-[calc(var(--safe-bottom)+84px)] z-[4] p-3.5">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex gap-2.5 items-center justify-between mb-3">
          <div className="min-w-0">
            <div className="font-black tracking-wide">{title}</div>
            <div className="text-xs font-extrabold text-muted">{subtitle}</div>
          </div>
          {session && session.status === 'running' && (
            <button
              className="glass-button px-3 py-2.5 rounded-2xl font-bold cursor-pointer text-sm"
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
          onMouseDown={() => triggerHaptic('light')}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

