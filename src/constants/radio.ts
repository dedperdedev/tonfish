/** Станции радио: поток и опция "открыть на сайте" */
export interface RadioStation {
  id: string;
  name: string;
  /** Прямой URL потока (MP3 / AAC). */
  streamUrl: string;
  /** Ссылка на страницу радио (например 101.ru) для fallback */
  linkUrl?: string;
}

/**
 * Потоки 101.ru работают по формату:
 *   https://pub0202.101.ru:8000/stream/trust/mp3/128/{channelId}   — MP3 128 Kbps
 *   http://pub0302.101.ru:8000/stream/pro/aac/64/{channelId}       — AAC  64 Kbps
 *
 * Пользовательские (personal) станции — отдельный формат,
 * попробуем несколько вариантов; если CORS не пустит — показываем ссылку 101.ru.
 */

export const RADIO_STATIONS: RadioStation[] = [
  // ===== 101.ru — Авторская песня (бард, костровые, похожая атмосфера) =====
  {
    id: 'bard',
    name: '🎸 Авторская Песня',
    streamUrl: 'https://ic6.101.ru:8000/stream/pro/aac/64/35',
    linkUrl: 'https://101.ru/radio/channel/35',
  },

  // ===== 101.ru — Русский шансон (костровые, дорожные) =====
  {
    id: 'shanson',
    name: '🎸 Русский Шансон',
    streamUrl: 'https://pub0202.101.ru:8000/stream/trust/mp3/128/50',
    linkUrl: 'https://101.ru/radio/channel/50',
  },

  // ===== 101.ru — Deep House (расслабленный фон) =====
  {
    id: 'deep-house',
    name: '🎧 Deep House',
    streamUrl: 'https://pub0202.101.ru:8000/stream/trust/mp3/128/173',
    linkUrl: 'https://101.ru/radio/channel/173',
  },

  // ===== 101.ru — Relax FM =====
  {
    id: 'relax-fm',
    name: '🌊 Relax FM',
    streamUrl: 'https://ic4.101.ru:8000/stream/air/aac/64/200',
    linkUrl: 'https://relax-fm.ru/',
  },

  // ===== Radio Paradise (гарантированно работает без CORS) =====
  {
    id: 'radio-paradise',
    name: '🌴 Radio Paradise',
    streamUrl: 'https://stream.radioparadise.com/mp3-128',
  },
];
