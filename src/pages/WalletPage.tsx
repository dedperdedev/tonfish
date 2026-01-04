import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { VideoBackground } from '../components/VideoBackground';
import { formatTon, formatFish } from '../utils/formatters';
import { Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function WalletPage() {
  const balances = useGameStore((s) => s.balances);
  const [copied, setCopied] = useState(false);

  // Mock wallet address
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
      <VideoBackground opacity={0.18} />

      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-20 -webkit-overflow-scrolling-touch">
          <div className="game-card mb-2.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-[54px] h-[54px] rounded-[18px] bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center">
                <Wallet size={28} strokeWidth={2.5} className="text-ink" />
              </div>
              <div>
                <div className="font-black text-lg">Кошелёк</div>
                <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                  Баланс и транзакции
                </div>
              </div>
            </div>
          </div>

          <div className="game-card mb-2.5">
            <div className="font-black mb-2.5">Адрес кошелька</div>
            <div className="flex items-center gap-2.5">
              <div className="flex-1 px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85 font-mono text-sm font-black text-ink break-all">
                {walletAddress}
              </div>
              <button
                className="px-3.5 py-2.5 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer flex items-center gap-1.5"
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

          <div className="game-card mb-2.5">
            <div className="font-black mb-2.5">Балансы</div>
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between px-3 py-3 rounded-[18px] bg-white/55 border border-white/85">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-aqua to-aqua2 shadow-[inset_0_0_0_2px_rgba(255,255,255,.8),0_6px_12px_rgba(0,0,0,.12)]"></div>
                  <div>
                    <div className="text-xs font-extrabold text-muted">TON</div>
                    <div className="font-black text-lg">{formatTon(balances.ton)}</div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-muted">
                  ≈ {formatFish(balances.ton * 1000)} FISH
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-3 rounded-[18px] bg-white/55 border border-white/85">
                <div className="flex items-center gap-2.5">
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-sun to-sun2 shadow-[inset_0_0_0_2px_rgba(255,255,255,.8),0_6px_12px_rgba(0,0,0,.12)]"></div>
                  <div>
                    <div className="text-xs font-extrabold text-muted">FISH</div>
                    <div className="font-black text-lg">{formatFish(balances.fish)}</div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-muted">
                  ≈ {formatTon(balances.fish / 1000)} TON
                </div>
              </div>
            </div>
          </div>

          <div className="game-card">
            <div className="font-black mb-2.5">История транзакций</div>
            <div className="text-xs font-extrabold text-muted leading-[1.35]">
              История транзакций будет отображаться здесь.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

