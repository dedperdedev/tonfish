import { useGameStore } from '../store/gameStore';
import { Hud } from '../components/Hud';
import { VideoBackground } from '../components/VideoBackground';
import { formatFish } from '../utils/formatters';

export function FriendsPage() {
  const friends = useGameStore((s) => s.friends);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(friends.code);
      // You could add a toast here
    } catch {
      // Handle error
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <VideoBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <div className="relative z-[3] flex gap-2.5 items-center justify-between mt-1.5 mb-2.5">
          <h1 className="m-0 text-xl font-black tracking-wide font-heading">Друзья</h1>
          <button
            className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
            onClick={handleCopy}
          >
            ⧉
          </button>
        </div>

        <Hud />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-20 -webkit-overflow-scrolling-touch">
          <div className="game-card">
            <div className="font-black flex justify-between items-center">
              <span>Твой код</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-br from-sun/55 to-sun2/42 text-[#281600] border border-white/88 text-xs font-black">
                {friends.code}
              </span>
            </div>
            <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
              Бонусы тут моковые, но UI настоящий.
            </div>
          </div>

          <div className="game-card mt-2.5">
            <div className="font-black">Статистика</div>
            <div className="flex gap-2.5 flex-wrap items-center mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                <strong className="text-ink">{friends.invited}</strong> приглашено
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                <strong className="text-ink">{friends.active}</strong> активных
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                <strong className="text-ink">{formatFish(friends.earnedFish)}</strong> FISH
              </span>
            </div>
          </div>

          <div className="game-card mt-2.5">
            <div className="font-black">Топ друзей</div>
            <div className="text-xs font-extrabold text-muted leading-[1.35] mt-2">
              Мок-таблица, чтобы экран не выглядел как пустыня.
            </div>
            <div className="grid gap-2.5 mt-2.5">
              {friends.leaderboard.map((user, index) => (
                <div key={index} className="game-card">
                  <div className="flex justify-between items-center gap-2.5">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <div className="w-[46px] h-[46px] rounded-2xl bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black">{user.name}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {formatFish(user.earned)} FISH
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                      топ
                    </span>
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

