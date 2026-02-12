/** Станции радио: поток и опция "открыть на сайте" */
export interface RadioStation {
  id: string;
  name: string;
  /** Прямой URL потока (MP3/ AAC/ HLS). Если не работает — показываем linkUrl */
  streamUrl: string;
  /** Ссылка на страницу радио (например 101.ru) для fallback */
  linkUrl?: string;
}

/** Охота и Рыбалка — 101.ru user 614435. Поток может требовать CORS/домен 101.ru. */
const OHOTA_RYBALKA_STREAM = 'https://strm.101.ru:8000/user_614435_128';

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'ohota-rybalka',
    name: 'Охота и Рыбалка',
    streamUrl: OHOTA_RYBALKA_STREAM,
    linkUrl: 'https://101.ru/radio/user/614435',
  },
  {
    id: 'relax',
    name: 'Relax',
    streamUrl: 'https://stream.radioparadise.com/mp3-128',
  },
  {
    id: 'chill',
    name: 'Chill',
    streamUrl: 'https://stream.radioparadise.com/aac-128',
  },
];
