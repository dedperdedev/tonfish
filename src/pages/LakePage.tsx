import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { BottomPanel } from '../components/BottomPanel';
import { StartFishingModal } from '../components/StartFishingModal';
import { CatchModal } from '../components/CatchModal';
import { LakeBackground } from '../components/LakeBackground';

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
  const [catchResult, setCatchResult] = useState<any>(null);

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

  return (
    <div className="relative h-full w-full">
      {/* Lake scene background */}
      <LakeBackground />

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

