import { useGameStore } from '../store/gameStore';
import { triggerHaptic } from '../utils/haptics';

interface BottomPanelProps {
  onStartClick: () => void;
}

export function BottomPanel({ onStartClick }: BottomPanelProps) {
  const session = useGameStore((s) => s.getNormalizedSession());

  // Кнопка "Закинуть" показывается только когда нет активной сессии
  // Когда сессия активна (running или ready), кнопка скрыта (таймер показывается в центре)
  const showButton = !session || (session.status !== 'running' && session.status !== 'ready');
  const buttonText = 'Закинуть';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    onStartClick();
  };

  if (!showButton) {
    return null; // Скрываем кнопку когда сессия активна
  }

  return (
    <div className="absolute left-1/2 bottom-[calc(var(--safe-bottom)+90px)] z-[5] transform -translate-x-1/2" style={{ pointerEvents: 'auto' }}>
      <button
        className="w-[200px] h-[200px] rounded-full glass-card shadow-game grid place-items-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleClick}
        onMouseDown={() => triggerHaptic('light')}
        style={{ pointerEvents: 'auto' }}
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

