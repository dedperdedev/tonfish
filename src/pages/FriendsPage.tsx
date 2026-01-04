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
    // Telegram share functionality would go here
    handleCopy();
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            {/* Уровень 1 */}
            <div className="relative px-3 py-4 rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(255, 215, 0, 0.15)' }}>
              <div className="relative z-[1] flex flex-col items-center text-center">
                <div className="text-[11px] font-black text-ink uppercase tracking-wider mb-2">1 уровень</div>
                <div className="text-[36px] font-black text-ink mb-2 leading-none">
                  {friends.level1.invited}
                </div>
                <div className="text-sm font-black text-ink">
                  {friends.level1.percentage?.toFixed(2) || '5.00'}%
                </div>
              </div>
            </div>

            {/* Уровень 2 */}
            <div className="relative px-3 py-4 rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(100, 200, 255, 0.15)' }}>
              <div className="relative z-[1] flex flex-col items-center text-center">
                <div className="text-[11px] font-black text-ink uppercase tracking-wider mb-2">2 уровень</div>
                <div className="text-[36px] font-black text-ink mb-2 leading-none">
                  {friends.level2.invited}
                </div>
                <div className="text-sm font-black text-ink">
                  {friends.level2.percentage?.toFixed(2) || '3.00'}%
                </div>
              </div>
            </div>

            {/* Уровень 3 */}
            <div className="relative px-3 py-4 rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(200, 150, 255, 0.15)' }}>
              <div className="relative z-[1] flex flex-col items-center text-center">
                <div className="text-[11px] font-black text-ink uppercase tracking-wider mb-2 opacity-90">3 уровень</div>
                <div className="text-[36px] font-black text-ink mb-2 leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                  {friends.level3.invited}
                </div>
                <div className="text-sm font-black text-[#FFD700]">
                  {friends.level3.percentage?.toFixed(2) || '2.00'}%
                </div>
              </div>
            </div>
          </div>

          {/* Список друзей */}
          <div className="game-card">
            <div className="font-black mb-2.5">Друзья</div>
            <div className="grid gap-2.5">
              {friends.leaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-surface"
                >
                  <div className="w-[40px] h-[40px] rounded-full glass-surface grid place-items-center flex-shrink-0">
                    <span className="text-lg font-black text-ink">{getInitial(user.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm">{user.name}</div>
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

