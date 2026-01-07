import { useNavigate } from 'react-router-dom';
import { triggerHaptic } from '../utils/haptics';

interface NoRodModalProps {
  onClose: () => void;
}

export function NoRodModal({ onClose }: NoRodModalProps) {
  const navigate = useNavigate();

  const handleGoToShop = () => {
    triggerHaptic('success');
    navigate('/shop');
    onClose();
  };

  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.25)] backdrop-blur-[2px] flex items-center justify-center z-20 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl glass-card overflow-hidden animate-pop-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-0 flex-shrink-0">
          <h2 className="m-0 text-lg font-black font-heading">Нет удочки</h2>
          <p className="mt-1.5 mb-0 text-muted font-extrabold text-xs break-words">
            Чтобы начать рыбалку, нужно купить удочку в магазине.
          </p>
        </div>
        <div className="px-4 pb-4 grid gap-3 mt-4">
          <button
            className="game-button flex-shrink-0"
            onClick={handleGoToShop}
            onMouseDown={() => triggerHaptic('light')}
          >
            Перейти в магазин
          </button>
          <button
            className="glass-button w-full px-4 py-3 rounded-2xl font-bold cursor-pointer flex-shrink-0"
            onClick={onClose}
            onMouseDown={() => triggerHaptic('light')}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

