import { useGameStore } from '../store/gameStore';
import { Hud } from '../components/Hud';
import { VideoBackground } from '../components/VideoBackground';
import { formatFish } from '../utils/formatters';

const taskEmojis: Record<string, string> = {
  daily: '📅',
  sub: '📣',
  invite: '👥',
  firstbuy: '🛍️',
};

export function TasksPage() {
  const tasks = useGameStore((s) => s.tasks);
  const claimTask = useGameStore((s) => s.claimTask);

  const handleReset = () => {
    Object.keys(tasks).forEach((key) => {
      const task = tasks[key];
      if (task) {
        task.claimedAt = 0;
      }
    });
  };

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <VideoBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <div className="relative z-[3] flex gap-2.5 items-center justify-between mt-1.5 mb-2.5">
          <h1 className="m-0 text-xl font-black tracking-wide font-heading">Таски</h1>
          <button
            className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer"
            onClick={handleReset}
          >
            ↻
          </button>
        </div>

        <Hud />

        <div className="relative z-[3] flex-1 overflow-auto pb-3 -webkit-overflow-scrolling-touch">
          <div className="grid gap-2.5">
            {Object.values(tasks).map((task) => {
              if (!task) return null;
              const isDaily = task.id === 'daily';
              const now = Date.now();
              const canClaim = isDaily
                ? now - (task.claimedAt || 0) > 24 * 60 * 60 * 1000
                : task.claimedAt === 0;
              const claimed = (task.claimedAt || 0) > 0 && (!isDaily || !canClaim);

              return (
                <div key={task.id} className="game-card">
                  <div className="flex justify-between items-center gap-2.5">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <div className="w-[46px] h-[46px] rounded-2xl bg-gradient-to-br from-aqua/30 to-aqua2/20 border border-white/84 shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] grid place-items-center">
                        {taskEmojis[task.id] || '✅'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black">{task.title}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {task.desc}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/58 border border-white/80 text-xs font-black text-muted">
                        <strong className="text-ink">+{formatFish(task.reward)}</strong> FISH
                      </span>
                      <button
                        className="px-3.5 py-3 rounded-[18px] border border-white/85 bg-white/58 backdrop-blur-[10px] shadow-game-sm font-black cursor-pointer disabled:opacity-50"
                        onClick={() => claimTask(task.id)}
                        disabled={claimed}
                      >
                        {claimed ? 'Получено' : 'Забрать'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

