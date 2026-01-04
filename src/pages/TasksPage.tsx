import { useGameStore } from '../store/gameStore';
import { Header } from '../components/Header';
import { LakeBackground } from '../components/LakeBackground';
import { formatFish } from '../utils/formatters';
import { Icon, taskEmojiFallbacks } from '../utils/icons';
import { triggerHaptic } from '../utils/haptics';

export function TasksPage() {
  const tasks = useGameStore((s) => s.tasks);
  const claimTask = useGameStore((s) => s.claimTask);

  return (
    <div className="relative h-full w-full">
      {/* Background video */}
      <LakeBackground opacity={0.18} />

      {/* Screen content */}
      <div className="absolute inset-0 flex flex-col p-3.5 pb-[calc(var(--safe-bottom)+98px)] overflow-hidden">
        <Header />

        <div className="relative z-[2] flex-1 overflow-auto pt-2.5 pb-24 -webkit-overflow-scrolling-touch">
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
                      <div className="w-[46px] h-[46px] rounded-2xl glass-surface grid place-items-center">
                        <Icon
                          src={task.iconPath}
                          fallback={taskEmojiFallbacks[task.id] || '✅'}
                          alt={task.title}
                          size={32}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black">{task.title}</div>
                        <div className="text-xs font-extrabold text-muted leading-[1.35] mt-0.5">
                          {task.desc}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-surface text-xs font-bold text-muted">
                        <strong className="text-ink">+{formatFish(task.reward)}</strong> FISH
                      </span>
                      <button
                        className="glass-button px-4 py-2.5 rounded-2xl font-bold cursor-pointer disabled:opacity-50 text-sm"
                        onClick={() => {
                          triggerHaptic('success');
                          claimTask(task.id);
                        }}
                        onMouseDown={() => triggerHaptic('light')}
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

