import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { RADIO_STATIONS, type RadioStation } from '../constants/radio';

interface RadioContextValue {
  stations: RadioStation[];
  currentStation: RadioStation;
  currentStationId: string;
  setStation: (id: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  error: string | null;
  clearError: () => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

const VOLUME_KEY = 'fish-radio-volume';

function getStoredVolume(): number {
  try {
    const v = localStorage.getItem(VOLUME_KEY);
    if (v != null) {
      const n = Number(v);
      if (n >= 0 && n <= 1) return n;
    }
  } catch {
    // ignore
  }
  return 0.7;
}

export function RadioProvider({ children }: { children: ReactNode }) {
  const [currentStationId, setCurrentStationId] = useState(RADIO_STATIONS[0].id);
  const [volume, setVolumeState] = useState(getStoredVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStation = RADIO_STATIONS.find((s) => s.id === currentStationId) ?? RADIO_STATIONS[0];

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const onError = () => setError('Не удалось загрузить поток');
    const onCanPlay = () => setError(null);
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // ignore
    }
  }, [volume]);

  const setStation = useCallback((id: string) => {
    const station = RADIO_STATIONS.find((s) => s.id === id);
    if (!station) return;
    setCurrentStationId(id);
    setError(null);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = station.streamUrl;
      audio.load();
      audio.play().catch(() => setError('Не удалось воспроизвести'));
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setError(null);
      if (!audio.src || audio.src === window.location.href) {
        audio.src = currentStation.streamUrl;
        audio.load();
      }
      audio.play().catch(() => setError('Не удалось воспроизвести'));
    }
  }, [isPlaying, currentStation.streamUrl]);

  const setVolume = useCallback((v: number) => {
    const value = Math.max(0, Math.min(1, v));
    setVolumeState(value);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: RadioContextValue = {
    stations: RADIO_STATIONS,
    currentStation,
    currentStationId,
    setStation,
    volume,
    setVolume,
    isPlaying,
    togglePlay,
    error,
    clearError,
  };

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used within RadioProvider');
  return ctx;
}
