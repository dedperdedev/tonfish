import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';

export function WalletPage() {
  const balances = useGameStore((s) => s.balances);
  const [copied, setCopied] = useState(false);

  const walletAddress = 'EQD...' + Math.random().toString(36).slice(2, 10).toUpperCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handle error
    }
  };

  return (
    <div className="relative h-full w-full">
      <LakeBackground opacity={0.18} />

      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <div className="game-card">
              <div className="text-xs font-extrabold text-muted mb-1">TON</div>
              <div className="font-black text-lg">{formatTon(balances.ton)}</div>
            </div>
            <div className="game-card">
              <div className="text-xs font-extrabold text-muted mb-1">FISH</div>
              <div className="font-black text-lg">{formatFish(balances.fish)}</div>
            </div>
          </div>

          <button className="game-button text-sm py-3.5 px-3.5 min-h-[48px] mb-2.5">
            Подключение кошелька
          </button>

          <div className="game-card mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex-1 px-3 py-2.5 rounded-2xl glass-surface font-mono text-sm font-bold text-ink break-all">
                {walletAddress}
              </div>
              <button
                className="glass-button px-3.5 py-2.5 rounded-2xl font-bold cursor-pointer flex items-center gap-1.5 text-sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    <span className="text-xs">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} strokeWidth={2.5} />
                    <span className="text-xs">Копировать</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <button className="game-button text-sm py-3.5 px-3.5 min-h-[48px]">
              Пополнить
            </button>
            <button className="glass-button w-full px-4 py-3 rounded-2xl font-bold cursor-pointer">
              Вывести
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

