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
const STATION_KEY = 'fish-radio-station';

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

function getStoredStation(): string {
  try {
    const id = localStorage.getItem(STATION_KEY);
    if (id && RADIO_STATIONS.some((s) => s.id === id)) return id;
  } catch {
    // ignore
  }
  return RADIO_STATIONS[0].id;
}

/** Попытка воспроизвести аудио и вернуть true/false */
async function tryPlay(audio: HTMLAudioElement, url: string): Promise<boolean> {
  return new Promise((resolve) => {
    audio.pause();
    audio.src = url;
    audio.load();

    const timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, 8000);

    const onCanPlay = () => {
      cleanup();
      audio
        .play()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    };

    const onError = () => {
      cleanup();
      resolve(false);
    };

    function cleanup() {
      clearTimeout(timeout);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    }

    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('error', onError, { once: true });
  });
}

export function RadioProvider({ children }: { children: ReactNode }) {
  const [currentStationId, setCurrentStationId] = useState(getStoredStation);
  const [volume, setVolumeState] = useState(getStoredVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStation =
    RADIO_STATIONS.find((s) => s.id === currentStationId) ?? RADIO_STATIONS[0];

  // Create audio element once
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onPlaying = () => { setIsPlaying(true); setLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Volume sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    try { localStorage.setItem(VOLUME_KEY, String(volume)); } catch { /* */ }
  }, [volume]);

  // Save station choice
  useEffect(() => {
    try { localStorage.setItem(STATION_KEY, currentStationId); } catch { /* */ }
  }, [currentStationId]);

  /** Play given station, retry without crossOrigin on CORS failure */
  const playStation = useCallback(async (station: RadioStation) => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);
    setLoading(true);

    // Try with crossOrigin
    audio.crossOrigin = 'anonymous';
    let ok = await tryPlay(audio, station.streamUrl);

    if (!ok) {
      // Retry without crossOrigin (allows playback even if CORS headers missing)
      audio.crossOrigin = '';
      audio.removeAttribute('crossorigin');
      ok = await tryPlay(audio, station.streamUrl);
    }

    if (!ok) {
      setLoading(false);
      const msg = station.linkUrl
        ? 'Поток недоступен — откройте на сайте 101.ru'
        : 'Не удалось воспроизвести';
      setError(msg);
    }
  }, []);

  const setStation = useCallback((id: string) => {
    const station = RADIO_STATIONS.find((s) => s.id === id);
    if (!station) return;
    setCurrentStationId(id);
    playStation(station);
  }, [playStation]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      playStation(currentStation);
    }
  }, [isPlaying, currentStation, playStation]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: RadioContextValue = {
    stations: RADIO_STATIONS,
    currentStation,
    currentStationId,
    setStation,
    volume,
    setVolume,
    isPlaying: isPlaying || loading,
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
