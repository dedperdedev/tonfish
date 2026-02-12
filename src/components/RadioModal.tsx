import { useRadio } from '../contexts/RadioContext';
import { triggerHaptic } from '../utils/haptics';
import { Play, Pause, Volume2, RadioReceiver } from 'lucide-react';

interface RadioModalProps {
  onClose: () => void;
}

export function RadioModal({ onClose }: RadioModalProps) {
  const {
    stations,
    currentStation,
    currentStationId,
    setStation,
    volume,
    setVolume,
    isPlaying,
    togglePlay,
    error,
    clearError,
  } = useRadio();

  const handlePlayPause = () => {
    triggerHaptic('light');
    togglePlay();
  };

  const handleStationSelect = (id: string) => {
    if (id === currentStationId) return;
    triggerHaptic('light');
    setStation(id);
  };

  const handleOpenExternal = () => {
    if (currentStation.linkUrl) window.open(currentStation.linkUrl, '_blank');
  };

  return (
    <div
      className="absolute inset-0 bg-[rgba(0,20,30,.25)] backdrop-blur-[2px] flex items-center justify-center z-20 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl glass-card overflow-hidden animate-pop-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-0 flex-shrink-0 flex items-center justify-between">
          <h2 className="m-0 text-lg font-black font-heading flex items-center gap-2">
            <RadioReceiver size={22} strokeWidth={2.5} className="text-ink" />
            Радио
          </h2>
        </div>

        {/* Волны / станции */}
        <div className="px-4 pt-4">
          <p className="text-muted font-extrabold text-xs mb-2">Волна</p>
          <div className="flex flex-col gap-2">
            {stations.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStationSelect(s.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold cursor-pointer transition-all flex items-center justify-between ${
                  s.id === currentStationId
                    ? 'game-button'
                    : 'glass-button'
                }`}
                onMouseDown={() => triggerHaptic('light')}
              >
                <span>{s.name}</span>
                {s.id === currentStationId && isPlaying && (
                  <span className="text-xs font-extrabold text-muted">● в эфире</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ошибка и ссылка на 101.ru */}
        {error && (
          <div className="px-4 pt-3">
            <p className="text-sm font-bold text-red-600 mb-2">{error}</p>
            {currentStation.linkUrl && (
              <button
                type="button"
                className="glass-button w-full px-4 py-2.5 rounded-2xl font-bold cursor-pointer text-sm"
                onClick={handleOpenExternal}
                onMouseDown={() => triggerHaptic('light')}
              >
                Слушать на 101.ru →
              </button>
            )}
            <button
              type="button"
              className="mt-2 text-xs font-extrabold text-muted cursor-pointer"
              onClick={clearError}
            >
              Скрыть
            </button>
          </div>
        )}

        {/* Громкость */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-muted font-extrabold text-xs mb-2 flex items-center gap-1.5">
            <Volume2 size={14} strokeWidth={2.5} />
            Громкость
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/50 accent-sun"
            style={{ WebkitAppearance: 'slider-horizontal' }}
          />
        </div>

        {/* Play / Pause */}
        <div className="p-4 pt-3 flex gap-3">
          <button
            type="button"
            className={`game-button flex-1 flex items-center justify-center gap-2 py-3.5`}
            onClick={handlePlayPause}
            onMouseDown={() => triggerHaptic('light')}
          >
            {isPlaying ? (
              <>
                <Pause size={22} strokeWidth={2.5} />
                Пауза
              </>
            ) : (
              <>
                <Play size={22} strokeWidth={2.5} />
                Играть
              </>
            )}
          </button>
          <button
            type="button"
            className="glass-button px-4 py-3 rounded-2xl font-bold cursor-pointer flex-shrink-0"
            onClick={onClose}
            onMouseDown={() => triggerHaptic('light')}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
