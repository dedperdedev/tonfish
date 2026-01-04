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
    navigate('/market');
    onClose();
  };


  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.28)] flex items-center justify-center z-20 p-4.5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[90vh] rounded-[32px] glass-card shadow-[0_28px_80px_rgba(0,30,45,.35)] overflow-hidden animate-pop-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4.5 pb-0 flex-shrink-0">
          <h2 className="m-0 text-lg font-black font-heading">Улов!</h2>
        </div>
        <div className="mx-3.5 my-3.5 rounded-2xl bg-gradient-to-b from-aqua/28 to-sun/18 border border-white/90 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] h-[180px] min-h-[180px] grid place-items-center relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.75),rgba(255,255,255,0)_60%)] rotate-[18deg]"></div>
          <div className="z-[2] flex items-center justify-center w-full h-full">
            <img
              src={catchResult.icon}
              alt={catchResult.name}
              style={{ width: 160, height: 160, objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="px-4.5 pb-4.5 grid gap-2.5 overflow-y-auto flex-1 min-h-0">
          <div className="flex items-start justify-between gap-3 px-3.5 py-3 rounded-[18px] glass-card flex-shrink-0">
            <div className="min-w-0 flex-1">
              <div className="text-lg font-black break-words leading-tight">{catchResult.name}</div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              {catchResult.payoutTon > 0 && (
                <div className="text-lg font-black whitespace-nowrap mb-1">
                  {formatTon(catchResult.payoutTon)} TON
                </div>
              )}
              <div className="text-sm font-black text-muted whitespace-nowrap">
                ≈ {formatFish(catchResult.payoutFish)} FISH
              </div>
            </div>
          </div>
          <button 
            className="game-button text-sm py-3.5 px-3.5 min-h-[48px] flex-shrink-0" 
            onClick={handleSell}
            onMouseDown={() => triggerHaptic('light')}
          >
            Продать
          </button>
        </div>
      </div>
    </div>
  );
}

