import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, rods } from '../store/gameStore';
import { Header } from '../components/Header';
import { FloatBobber } from '../components/FloatBobber';
import { VideoBackground } from '../components/VideoBackground';
import { formatTime, getProgress } from '../utils/session';
import { formatTon, formatFish } from '../utils/formatters';

const CIRCUMFERENCE = 590.619;

export function FishingPage() {
  const navigate = useNavigate();
  const session = useGameStore((s) => s.getNormalizedSession());
  const claimCatch = useGameStore((s) => s.claimCatch);
  const fastForwardSession = useGameStore((s) => s.fastForwardSession);
  const [timeRemaining, setTimeRemaining] = useState('--:--:--');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!session) return;

    const update = () => {
      if (session.status === 'running') {
        const remaining = session.endAt - Date.now();
        setTimeRemaining(formatTime(remaining));
        setProgress(getProgress(session));
      } else if (session.status === 'ready') {
        setTimeRemaining('00:00:00');
        setProgress(1);
      }
    };

    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <div className="relative h-full w-full">
        <VideoBackground />
        <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="font-black text-lg">Сессия не запущена</p>
              <button
                className="game-button mt-4"
                onClick={() => navigate('/lake')}
              >
                На озеро
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rod = rods.find((r) => r.id === session.rodId);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleClaim = () => {
    if (session.status === 'ready') {
      const result = claimCatch();
      if (result) {
        navigate('/lake');
      }
    } else {
      navigate('/lake');
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <VideoBackground />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[4] flex-1 flex items-center justify-center pt-4.5">
          <div className="w-[240px] h-[240px] rounded-full glass-card shadow-game grid place-items-center relative overflow-hidden">
            {session.status === 'ready' ? (
              <button
                className="w-full h-full rounded-full grid place-items-center cursor-pointer hover:opacity-90 transition-opacity z-[2] relative"
                onClick={handleClaim}
              >
                <div className="text-center">
                  <h2 className="m-0 text-[34px] font-black tracking-wide font-heading pulse">
                    Подсечь
                  </h2>
                </div>
              </button>
            ) : (
              <>
                <svg
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  className="absolute inset-0"
                >
                  <circle
                    cx="120"
                    cy="120"
                    r="94"
                    fill="none"
                    stroke="rgba(11,42,51,.10)"
                    strokeWidth="14"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="94"
                    fill="none"
                    stroke="rgba(31,225,194,.85)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 120 120)"
                  />
                </svg>
                <div className="text-center z-[2]">
                  <h2 className="m-0 text-[34px] font-black tracking-wide font-heading">
                    {timeRemaining}
                  </h2>
                  <p className="mt-1.5 mb-0 text-[13px] font-black text-muted">
                    до улова
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <FloatBobber />

        <div className="absolute left-3.5 right-3.5 bottom-[calc(var(--safe-bottom)+84px)] z-[4] p-3.5">
          <div className="glass-card rounded-xl shadow-game p-3.5">
            <div className="flex gap-2.5 items-center justify-between mb-2.5">
              <div className="min-w-0">
                <div className="font-black">
                  Удочка: {rod?.name || '—'}
                </div>
                <div className="text-xs font-extrabold text-muted">
                  Сумма:{' '}
                  {session.currency === 'TON'
                    ? `${formatTon(session.stakeAmount)} TON`
                    : `${formatFish(session.stakeAmount)} FISH`}
                </div>
              </div>
              {session.status === 'running' && (
                <button
                  className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
                  onClick={fastForwardSession}
                  title="Dev: Завершить сессию"
                >
                  ⚡
                </button>
              )}
            </div>
            <button
              className={`game-button ${session.status === 'ready' ? 'pulse' : ''}`}
              onClick={handleClaim}
            >
              {session.status === 'ready' ? 'Забрать улов' : 'Свернуть на озеро'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

