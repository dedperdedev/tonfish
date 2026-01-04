import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';
import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

interface HeaderProps {
  title?: string;
  rightContent?: ReactNode;
}

export function Header({ title, rightContent }: HeaderProps) {
  const navigate = useNavigate();
  const balances = useGameStore((s) => s.balances);
  const devAddResources = useGameStore((s) => s.devAddResources);
  const [tapCount, setTapCount] = useState(0);

  const handleBalanceClick = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      devAddResources();
      setTapCount(0);
    }
  };

  return (
    <div className="relative z-[3] flex gap-2.5 items-center justify-between mb-2.5" style={{ margin: 0, border: 0 }}>
      {title && (
        <h1 className="m-0 text-xl font-black tracking-wide font-heading">{title}</h1>
      )}
      {rightContent && !title && <div></div>}
      
      <div className="flex gap-2.5 items-center flex-shrink-0">
        {rightContent && <div className="mr-auto">{rightContent}</div>}
        
        <div className="flex gap-2.5 items-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full scrim shadow-game-sm cursor-pointer select-none h-[42px]"
            onClick={handleBalanceClick}
          >
            <small className="text-muted font-extrabold">TON</small>
            <b className="font-black tracking-wide">{formatTon(balances.ton)}</b>
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full scrim shadow-game-sm cursor-pointer select-none h-[42px]"
            onClick={handleBalanceClick}
          >
            <small className="text-muted font-extrabold">FISH</small>
            <b className="font-black tracking-wide">{formatFish(balances.fish)}</b>
          </div>
          <button
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-full scrim shadow-game-sm h-[42px] w-[54px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/wallet')}
            title="Кошелёк"
          >
            <Wallet size={20} strokeWidth={2.5} className="text-ink" />
          </button>
        </div>
      </div>
    </div>
  );
}

