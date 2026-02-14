import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { Copy, Users } from 'lucide-react';
import { useState } from 'react';

export function FriendsPage() {
  const friends = useGameStore((s) => s.friends);
  const [copied, setCopied] = useState(false);

  const referralLink = `t.me/bot?startapp=referr_${friends.code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Handle error
    }
  };

  const handleInvite = () => {
    handleCopy();
  };

  const levelConfig = [
    { level: 1, invited: friends.level1.invited, percentage: friends.level1.percentage ?? 5, bg: 'rgba(255, 215, 0, 0.15)' },
    { level: 2, invited: friends.level2.invited, percentage: friends.level2.percentage ?? 3, bg: 'rgba(100, 200, 255, 0.15)' },
    { level: 3, invited: friends.level3.invited, percentage: friends.level3.percentage ?? 2, bg: 'rgba(200, 150, 255, 0.15)' },
  ] as const;

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <LakeBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
          {/* Реферальная ссылка */}
          <div className="game-card mb-2.5">
            <div className="font-black mb-2.5">Реферальная ссылка</div>
                    <div className="px-3 py-2.5 rounded-2xl glass-surface font-mono text-sm font-bold text-ink break-all mb-2.5">
              {referralLink}
            </div>
            <div className="flex gap-2.5 items-center">
              <button
                className="glass-button px-3.5 py-3 rounded-2xl font-bold cursor-pointer flex items-center justify-center flex-shrink-0"
                onClick={handleCopy}
                title={copied ? 'Скопировано' : 'Копировать'}
              >
                <Copy size={18} strokeWidth={2.5} className={copied ? 'text-green-600' : 'text-ink'} />
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-2xl game-button font-bold cursor-pointer flex items-center justify-center gap-2"
                onClick={handleInvite}
              >
                <Users size={18} strokeWidth={2.5} />
                <span className="text-sm">Пригласить друзей</span>
              </button>
            </div>
          </div>

          {/* Уровни реферальной системы */}
          <div className="flex flex-col gap-2.5 mb-2.5">
            {levelConfig.map(({ level, invited, percentage, bg }) => (
              <div
                key={level}
                className="rounded-2xl overflow-hidden px-4 py-4"
                style={{
                  background: bg,
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl px-3 py-3 bg-white/25 border border-white/40 text-center">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Уровень</div>
                    <div className="text-lg font-black text-ink">{level}</div>
                  </div>
                  <div className="rounded-xl px-3 py-3 bg-white/25 border border-white/40 text-center">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Рефералов</div>
                    <div className="text-lg font-black text-ink">{invited}</div>
                  </div>
                  <div className="rounded-xl px-3 py-3 bg-white/25 border border-white/40 text-center">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Процент</div>
                    <div className="text-lg font-black text-ink">{percentage.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

