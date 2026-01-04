import { Header } from '../components/Header';
import { VideoBackground } from '../components/VideoBackground';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function WalletPage() {
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

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
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
        </div>
      </div>
    </div>
  );
}

