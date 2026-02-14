import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';
import { triggerHaptic } from '../utils/haptics';
import type { CatchResult } from '../types';

interface CatchModalProps {
  catchResult: CatchResult | null;
  onClose: () => void;
}

export function CatchModal({ catchResult, onClose }: CatchModalProps) {
  const navigate = useNavigate();

  if (!catchResult) return null;

  const handleSell = () => {
    triggerHaptic('success');
    // Add directly to market.listed (bypass inventory)
    useGameStore.setState((state) => ({
      market: {
        ...state.market,
        listed: [...state.market.listed, { ...catchResult, status: 'in_inventory' as const }],
      },
    }));
    navigate('/shop');
    onClose();
  };


  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.25)] backdrop-blur-[2px] flex items-center justify-center z-20 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[90vh] rounded-3xl glass-card overflow-hidden animate-pop-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-0 flex-shrink-0">
          <h2 className="m-0 text-lg font-black font-heading">Улов!</h2>
        </div>
        <div className="mx-4 my-4 rounded-2xl glass-surface h-[180px] min-h-[180px] grid place-items-center relative overflow-hidden flex-shrink-0">
          <div className="z-[2] flex items-center justify-center w-full h-full">
            <img
              src={import.meta.env.DEV ? catchResult.icon : `${import.meta.env.BASE_URL}${catchResult.icon.replace(/^\//, '')}`}
              alt={catchResult.name}
              style={{ width: 160, height: 160, objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="px-4 pb-4 grid gap-3 overflow-y-auto flex-1 min-h-0">
          <div className="flex items-start justify-between gap-3 px-4 py-3 rounded-2xl glass-surface flex-shrink-0">
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black break-words leading-tight">{catchResult.name}</div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              {catchResult.payoutTon > 0 && (
                <div className="text-lg font-black whitespace-nowrap mb-1">
                  {formatTon(catchResult.payoutTon)} TON
                </div>
              )}
              {(catchResult.payoutStars ?? 0) > 0 && (
                <div className="text-lg font-black whitespace-nowrap mb-1">
                  +{catchResult.payoutStars} звёзд
                </div>
              )}
              {catchResult.payoutFish > 0 && (
                <div className="text-sm font-black text-muted whitespace-nowrap">
                  ≈ {formatFish(catchResult.payoutFish)} FISH
                </div>
              )}
            </div>
          </div>
          <button 
            className="game-button text-sm py-3 px-4 min-h-[48px] flex-shrink-0" 
            onClick={(catchResult.payoutStars ?? 0) > 0 ? onClose : handleSell}
            onMouseDown={() => triggerHaptic('light')}
          >
            {(catchResult.payoutStars ?? 0) > 0 ? 'Забрать' : 'Продать'}
          </button>
        </div>
      </div>
    </div>
  );
}

