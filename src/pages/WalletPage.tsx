import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { Copy, Check, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  currency: 'TON' | 'FISH';
  amount: number;
  date: Date;
  hash: string;
}

export function WalletPage() {
  const balances = useGameStore((s) => s.balances);
  const [copied, setCopied] = useState(false);

  // Mock wallet address
  const walletAddress = 'EQD...' + Math.random().toString(36).slice(2, 10).toUpperCase();

  // Demo transactions
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      currency: 'TON',
      amount: 50,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      hash: '0x' + Math.random().toString(16).slice(2, 10),
    },
    {
      id: '2',
      type: 'withdraw',
      currency: 'FISH',
      amount: 5000,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      hash: '0x' + Math.random().toString(16).slice(2, 10),
    },
    {
      id: '3',
      type: 'deposit',
      currency: 'FISH',
      amount: 12000,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      hash: '0x' + Math.random().toString(16).slice(2, 10),
    },
    {
      id: '4',
      type: 'withdraw',
      currency: 'TON',
      amount: 25,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      hash: '0x' + Math.random().toString(16).slice(2, 10),
    },
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} дн. назад`;
    } else if (hours > 0) {
      return `${hours} ч. назад`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes} мин. назад` : 'Только что';
    }
  };

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

          <div className="game-card">
            <div className="font-black mb-2.5">История транзакций</div>
            <div className="grid gap-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-surface"
                >
                  <div
                    className={`w-[40px] h-[40px] rounded-full grid place-items-center flex-shrink-0 ${
                      tx.type === 'deposit'
                        ? 'bg-gradient-to-br from-green-400/30 to-green-500/20'
                        : 'bg-gradient-to-br from-red-400/30 to-red-500/20'
                    }`}
                  >
                    {tx.type === 'deposit' ? (
                      <ArrowDownCircle size={20} strokeWidth={2.5} className="text-green-600" />
                    ) : (
                      <ArrowUpCircle size={20} strokeWidth={2.5} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm">
                      {tx.type === 'deposit' ? 'Пополнение' : 'Вывод'}
                    </div>
                    <div className="text-xs font-extrabold text-muted">
                      {formatDate(tx.date)} • {tx.hash.slice(0, 8)}...
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className={`font-black text-sm ${
                        tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}
                      {tx.currency === 'TON'
                        ? formatTon(tx.amount)
                        : formatFish(tx.amount)}{' '}
                      {tx.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

