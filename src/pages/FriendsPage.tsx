import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { Copy, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Моковые данные рефералов для каждого уровня
const mockReferrals = {
  level1: [
    { name: 'SpeedDial189', earned: 3200, active: true },
    { name: 'TheDarknessG', earned: 2180, active: true },
    { name: 'Serg197205m', earned: 1740, active: true },
    { name: 'Mtprup', earned: 980, active: false },
    { name: 'User123', earned: 500, active: true },
  ],
  level2: [
    { name: 'Friend1', earned: 1200, active: true },
    { name: 'Friend2', earned: 800, active: true },
    { name: 'Friend3', earned: 600, active: false },
  ],
  level3: [
    { name: 'Referral1', earned: 400, active: true },
    { name: 'Referral2', earned: 200, active: false },
  ],
};

export function FriendsPage() {
  const friends = useGameStore((s) => s.friends);
  const [copied, setCopied] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<1 | 2 | 3 | null>(null);

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
          <div className="flex flex-col gap-2.5 mb-2.5">
            {/* Уровень 1 */}
            <div className="relative w-full rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(255, 215, 0, 0.15)' }}>
              <button
                className="w-full px-6 py-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedLevel(expandedLevel === 1 ? null : 1)}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-base font-black text-ink uppercase tracking-wider">1 уровень</div>
                  <div className="text-[48px] font-black text-ink leading-none">
                    {friends.level1.invited}
                  </div>
                  <div className="text-lg font-black text-ink">
                    {friends.level1.percentage?.toFixed(2) || '5.00'}%
                  </div>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-ink transition-transform duration-200 flex-shrink-0 ${expandedLevel === 1 ? 'rotate-180' : ''}`}
                />
              </button>
              {/* Выплывающий список рефералов */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedLevel === 1 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {mockReferrals.level1.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-surface"
                    >
                      <div className="w-[36px] h-[36px] rounded-full glass-surface grid place-items-center flex-shrink-0">
                        <span className="text-sm font-black text-ink">{getInitial(ref.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm">{ref.name}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {ref.earned} FISH • {ref.active ? 'Активен' : 'Неактивен'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Уровень 2 */}
            <div className="relative w-full rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(100, 200, 255, 0.15)' }}>
              <button
                className="w-full px-6 py-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedLevel(expandedLevel === 2 ? null : 2)}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-base font-black text-ink uppercase tracking-wider">2 уровень</div>
                  <div className="text-[48px] font-black text-ink leading-none">
                    {friends.level2.invited}
                  </div>
                  <div className="text-lg font-black text-ink">
                    {friends.level2.percentage?.toFixed(2) || '3.00'}%
                  </div>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-ink transition-transform duration-200 flex-shrink-0 ${expandedLevel === 2 ? 'rotate-180' : ''}`}
                />
              </button>
              {/* Выплывающий список рефералов */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedLevel === 2 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {mockReferrals.level2.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-surface"
                    >
                      <div className="w-[36px] h-[36px] rounded-full glass-surface grid place-items-center flex-shrink-0">
                        <span className="text-sm font-black text-ink">{getInitial(ref.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm">{ref.name}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {ref.earned} FISH • {ref.active ? 'Активен' : 'Неактивен'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Уровень 3 */}
            <div className="relative w-full rounded-2xl glass-card overflow-hidden" style={{ background: 'rgba(200, 150, 255, 0.15)' }}>
              <button
                className="w-full px-6 py-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedLevel(expandedLevel === 3 ? null : 3)}
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-base font-black text-ink uppercase tracking-wider">3 уровень</div>
                  <div className="text-[48px] font-black text-ink leading-none">
                    {friends.level3.invited}
                  </div>
                  <div className="text-lg font-black text-ink">
                    {friends.level3.percentage?.toFixed(2) || '2.00'}%
                  </div>
                </div>
                <ChevronDown 
                  size={28} 
                  className={`text-ink transition-transform duration-200 flex-shrink-0 ${expandedLevel === 3 ? 'rotate-180' : ''}`}
                />
              </button>
              {/* Выплывающий список рефералов */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedLevel === 3 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-2 space-y-2">
                  {mockReferrals.level3.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl glass-surface"
                    >
                      <div className="w-[36px] h-[36px] rounded-full glass-surface grid place-items-center flex-shrink-0">
                        <span className="text-sm font-black text-ink">{getInitial(ref.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm">{ref.name}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {ref.earned} FISH • {ref.active ? 'Активен' : 'Неактивен'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

