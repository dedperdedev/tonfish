import { useGameStore } from '../store/gameStore';
import { FishActionButton } from './FishActionButton';

interface BottomPanelProps {
  onStartClick: () => void;
}

export function BottomPanel({ onStartClick }: BottomPanelProps) {
  const session = useGameStore((s) => s.getNormalizedSession());

  // Кнопка "Закинуть" показывается только когда нет активной сессии
  // Когда сессия активна (running или ready), кнопка скрыта (таймер показывается в центре)
  const showButton = !session || (session.status !== 'running' && session.status !== 'ready');

  if (!showButton) {
    return null; // Скрываем кнопку когда сессия активна
  }

  return (
    <div className="absolute left-1/2 bottom-[calc(var(--safe-bottom)+90px)] z-[4] transform -translate-x-1/2" style={{ pointerEvents: 'auto' }}>
      <FishActionButton
        state="cast"
        onClick={onStartClick}
      />
    </div>
  );
}

