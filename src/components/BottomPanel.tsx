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

  let buttonText = '';
  let pulse = false;

  if (!equippedRod) {
    buttonText = 'Выбрать удочку';
  } else if (!session) {
    buttonText = 'Закинуть';
  } else if (session.status === 'running') {
    buttonText = 'Открыть рыбалку';
  } else if (session.status === 'ready') {
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

  return (
    <div className="absolute left-1/2 bottom-[calc(var(--safe-bottom)+84px)] z-[4] transform -translate-x-1/2">
      <button
        className={`w-[200px] h-[200px] rounded-full glass-card shadow-game grid place-items-center cursor-pointer hover:opacity-90 transition-opacity ${pulse ? 'pulse' : ''}`}
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

