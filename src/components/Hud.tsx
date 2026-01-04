import { useGameStore } from '../store/gameStore';
import { formatTon, formatFish } from '../utils/formatters';
import { useState } from 'react';

export function Hud() {
  const balances = useGameStore((s) => s.balances);
  const devAddResources = useGameStore((s) => s.devAddResources);
  const [weather] = useState(() => {
    const weathers = ['☀️', '🌤️', '⛅', '🌦️'];
    return weathers[Math.floor(Math.random() * weathers.length)];
  });
  const [tapCount, setTapCount] = useState(0);

  const handleBalanceClick = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      devAddResources();
      setTapCount(0);
    }
  };

  return (
    <div className="relative z-[3] grid grid-cols-[1fr_auto] gap-2.5 items-start">
      <div className="flex gap-2.5 flex-wrap">
        <div
          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full scrim shadow-game-sm cursor-pointer select-none"
          onClick={handleBalanceClick}
        >
          <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-aqua to-aqua2 shadow-[inset_0_0_0_2px_rgba(255,255,255,.8),0_6px_12px_rgba(0,0,0,.12)]"></span>
          <small className="text-muted font-extrabold">TON</small>
          <b className="font-black tracking-wide">{formatTon(balances.ton)}</b>
        </div>
        <div
          className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full scrim shadow-game-sm cursor-pointer select-none"
          onClick={handleBalanceClick}
        >
          <span className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-sun to-sun2 shadow-[inset_0_0_0_2px_rgba(255,255,255,.8),0_6px_12px_rgba(0,0,0,.12)]"></span>
          <small className="text-muted font-extrabold">FISH</small>
          <b className="font-black tracking-wide">{formatFish(balances.fish)}</b>
        </div>
      </div>
      <div className="inline-flex items-center justify-center px-3 py-2.5 rounded-full scrim shadow-game-sm w-auto h-auto min-w-[54px]">
        <span className="text-xl">{weather}</span>
      </div>
    </div>
  );
}

