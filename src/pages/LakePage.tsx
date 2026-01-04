import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { BottomPanel } from '../components/BottomPanel';
import { StartFishingModal } from '../components/StartFishingModal';
import { CatchModal } from '../components/CatchModal';
import { LakeBackground } from '../components/LakeBackground';
import { LakeCastOverlay } from '../components/LakeCastOverlay';
import { triggerHaptic } from '../utils/haptics';
import type { CatchResult } from '../types';

export function LakePage() {
  const navigate = useNavigate();
  const equippedRodId = useGameStore((s) => s.equippedRodId);
  const session = useGameStore((s) => s.getNormalizedSession());
  const startFishing = useGameStore((s) => s.startFishing);
  const claimCatch = useGameStore((s) => s.claimCatch);
  const buyRod = useGameStore((s) => s.buyRod);
  const ownedRods = useGameStore((s) => s.ownedRods);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);

  const handleStartClick = () => {
    if (!equippedRodId) {
      navigate('/shop');
      return;
    }

    if (!session) {
      setShowStartModal(true);
      return;
    }

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
    } else {
      startFishing(equippedRodId, stakeAmount);
    }
    setShowStartModal(false);
    navigate('/fishing');
  };

  const handleOpenFishing = () => {
    navigate('/fishing');
  };

  // Determine if cast overlay should be active
  const isCastActive = !!equippedRodId || (session?.status === 'running' || session?.status === 'ready');
  const castKey = session?.startAt || session?.id || Date.now();

  return (
    <div className="relative h-full w-full">
      {/* Lake scene background */}
      <LakeBackground />

      {/* Cast overlay */}
      <LakeCastOverlay
        rodId={equippedRodId as any}
        active={isCastActive}
        castKey={castKey}
        target={{ x: 0.54, y: 0.56 }}
      />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />
        <BottomPanel onStartClick={handleStartClick} onOpenFishing={handleOpenFishing} />
      </div>

      {/* Modals */}
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

