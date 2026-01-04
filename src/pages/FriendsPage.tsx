import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { VideoBackground } from '../components/VideoBackground';
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
      <VideoBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
          {/* Реферальная ссылка */}
          <div className="game-card mb-2.5">
            <div className="font-black mb-2.5">Реферальная ссылка</div>
            <div className="px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85 font-mono text-sm font-black text-ink break-all mb-2.5">
              {referralLink}
            </div>
            <div className="flex gap-2.5 items-center">
              <button
                className="px-3.5 py-3.5 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer flex items-center justify-center flex-shrink-0"
                onClick={handleCopy}
                title={copied ? 'Скопировано' : 'Копировать'}
              >
                <Copy size={18} strokeWidth={2.5} className={copied ? 'text-green-600' : 'text-ink'} />
              </button>
              <button
                className="flex-1 px-3.5 py-3.5 rounded-[18px] bg-gradient-to-br from-sun/55 to-sun2/45 text-[#281600] border border-white/88 shadow-[0_10px_22px_rgba(255,156,30,.22)] font-black cursor-pointer flex items-center justify-center gap-2"
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
            <div className="game-card border-2 border-[rgba(255,215,0,0.6)] bg-gradient-to-br from-[rgba(255,215,0,0.15)] to-[rgba(255,215,0,0.05)]">
              <div className="text-xs font-extrabold text-muted mb-1">1 уровень</div>
              <div className="text-3xl font-black text-[#FFD700] mb-1">{friends.level1.invited}</div>
              <div className="text-xs font-black text-[#FFD700]">
                {friends.level1.percentage?.toFixed(2) || '5.00'}%
              </div>
            </div>

            {/* Уровень 2 */}
            <div className="game-card">
              <div className="text-xs font-extrabold text-muted mb-1">2 уровень</div>
              <div className="text-3xl font-black text-ink mb-1">{friends.level2.invited}</div>
              <div className="text-xs font-black text-[#FFD700]">
                {friends.level2.percentage?.toFixed(2) || '3.00'}%
              </div>
            </div>

            {/* Уровень 3 */}
            <div className="game-card">
              <div className="text-xs font-extrabold text-muted mb-1">3 уровень</div>
              <div className="text-3xl font-black text-ink mb-1">{friends.level3.invited}</div>
              <div className="text-xs font-black text-[#FFD700]">
                {friends.level3.percentage?.toFixed(2) || '2.00'}%
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[18px] bg-white/55 border border-white/85"
                >
                  <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[rgba(255,215,0,0.3)] to-[rgba(255,215,0,0.1)] border-2 border-[rgba(255,215,0,0.6)] grid place-items-center flex-shrink-0">
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

