import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { BottomPanel } from '../components/BottomPanel';
import { StartFishingModal } from '../components/StartFishingModal';
import { CatchModal } from '../components/CatchModal';
import { NoRodModal } from '../components/NoRodModal';
import { LakeBackground } from '../components/LakeBackground';
import { triggerHaptic } from '../utils/haptics';
import { formatTime, getProgress } from '../utils/session';
import type { CatchResult } from '../types';

const CIRCUMFERENCE = 590.619;

export function LakePage() {
  const equippedRodId = useGameStore((s) => s.equippedRodId);
  const session = useGameStore((s) => s.getNormalizedSession());
  const startFishing = useGameStore((s) => s.startFishing);
  const claimCatch = useGameStore((s) => s.claimCatch);
  const buyRod = useGameStore((s) => s.buyRod);
  const ownedRods = useGameStore((s) => s.ownedRods);
  const fastForwardSession = useGameStore((s) => s.fastForwardSession);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showNoRodModal, setShowNoRodModal] = useState(false);
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('--:--:--');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!session) {
      setTimeRemaining('--:--:--');
      setProgress(0);
      return;
    }

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

  const handleStartClick = () => {
    // Если нет удочки - показываем модальное окно
    if (!equippedRodId) {
      setShowNoRodModal(true);
      return;
    }

    // Если нет сессии - показываем модальное окно для начала рыбалки
    if (!session) {
      setShowStartModal(true);
      return;
    }

    // Если сессия готова - забираем улов
    if (session.status === 'ready') {
      const result = claimCatch();
      if (result) {
        setCatchResult(result);
        setShowCatchModal(true);
      }
    }
  };

  const handleStartFishing = (stakeAmount: number) => {
    if (!equippedRodId) return;
    triggerHaptic('light');
    if (!ownedRods.includes(equippedRodId)) {
      buyRod(equippedRodId, stakeAmount);
      // После покупки запускаем рыбалку
      startFishing(equippedRodId, stakeAmount);
    } else {
      startFishing(equippedRodId, stakeAmount);
    }
    setShowStartModal(false);
    // Не переходим на /fishing, остаемся на /lake
  };

  return (
    <div className="relative h-full w-full">
      {/* Lake scene background */}
      <LakeBackground />


      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />
        
        {/* Timer circle - show when session is active */}
        {session && (session.status === 'running' || session.status === 'ready') && (
          <div className="absolute left-1/2 bottom-[calc(var(--safe-bottom)+90px)] z-[4] transform -translate-x-1/2">
            <div className="relative">
              {session.status === 'running' && (
                <button
                  className="absolute -left-14 top-1/2 -translate-y-1/2 glass-button w-12 h-12 rounded-2xl font-bold cursor-pointer flex items-center justify-center flex-shrink-0"
                  onClick={fastForwardSession}
                  title="Dev: Завершить сессию"
                  onMouseDown={() => triggerHaptic('light')}
                >
                  ⚡
                </button>
              )}
              {session.status === 'ready' ? (
                <button
                  className="w-full h-full rounded-full grid place-items-center cursor-pointer hover:opacity-90 transition-opacity z-[2] relative"
                  onClick={handleStartClick}
                  onMouseDown={() => triggerHaptic('light')}
                >
                  <div className="text-center">
                    <h2 className="m-0 text-[34px] font-black tracking-wide font-heading pulse">
                      Подсечь
                    </h2>
                  </div>
                </button>
              ) : (
                <div className="w-[240px] h-[240px] rounded-full glass-card shadow-game grid place-items-center relative overflow-hidden">
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
                      strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
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
                </div>
              )}
            </div>
          </div>
        )}
        
        <BottomPanel onStartClick={handleStartClick} />
      </div>

      {/* Modals */}
      {showNoRodModal && (
        <NoRodModal onClose={() => setShowNoRodModal(false)} />
      )}
      {showStartModal && equippedRodId && (
        <StartFishingModal
          rodId={equippedRodId}
          onStart={handleStartFishing}
          onClose={() => setShowStartModal(false)}
        />
      )}
      {showCatchModal && (
        <CatchModal catchResult={catchResult} onClose={() => setShowCatchModal(false)} />
      )}
    </div>
  );
}

