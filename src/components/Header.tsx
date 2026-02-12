import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';
import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Languages, RadioReceiver, Fish } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useRadioModal } from '../contexts/RadioModalContext';
import { TonIcon } from './TonIcon';

interface HeaderProps {
  title?: string;
  rightContent?: ReactNode;
}

export function Header({ title, rightContent }: HeaderProps) {
  const navigate = useNavigate();
  const { locale, toggleLocale } = useLocale();
  const { openRadioModal } = useRadioModal();
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
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-2xl glass-surface cursor-pointer select-none h-[42px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleBalanceClick}
          >
            <TonIcon className="w-5 h-5 flex-shrink-0" />
            <b className="font-black tracking-wide">{formatTon(balances.ton)}</b>
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-2xl glass-surface cursor-pointer select-none h-[42px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleBalanceClick}
          >
            <Fish size={20} strokeWidth={2.5} className="text-ink flex-shrink-0" />
            <b className="font-black tracking-wide">{formatFish(balances.fish)}</b>
          </div>
          <button
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-2xl glass-surface h-[42px] w-[54px] flex-shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={toggleLocale}
            title={locale === 'ru' ? 'Переключить на EN' : 'Switch to RU'}
          >
            <Languages size={20} strokeWidth={2.5} className="text-ink" />
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-2xl h-[42px] w-[54px] flex-shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'rgba(59, 130, 246, 0.7)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
            onClick={() => navigate('/wallet')}
            title="Кошелёк"
          >
            <Wallet size={20} strokeWidth={2.5} className="text-white" />
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-2xl h-[42px] w-[54px] flex-shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'rgba(245, 190, 30, 0.8)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
            title="Радио"
            onClick={openRadioModal}
          >
            <RadioReceiver size={20} strokeWidth={2.5} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

