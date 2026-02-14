/** Станции радио: поток и опция "открыть на сайте" */
export interface RadioStation {
  id: string;
  name: string;
  /** Прямой URL потока (MP3 / AAC). */
  streamUrl: string;
  /** Ссылка на страницу радио для fallback */
  linkUrl?: string;
}

/**
 * Только станции без CORS-блокировки.
 * Все потоки 101.ru блокируют CORS — не используем.
 */

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'spokoinoe',
    name: '🌿 Спокойное радио',
    streamUrl: 'https://listen1.myradio24.com/6262',
    linkUrl: 'http://spokoinoeradio.ru/',
  },
  {
    id: 'shanson',
    name: '🎸 Шансон',
    streamUrl: 'http://chanson.hostingradio.ru:8041/chanson-uncensored256.mp3',
    linkUrl: 'https://radioshanson.ru/',
  },
  {
    id: 'retro-fm',
    name: '📻 Ретро FM',
    streamUrl: 'http://retroserver.streamr.ru:8043/retro256.mp3',
    linkUrl: 'http://retrofm.ru/',
  },
  {
    id: 'rusrock',
    name: '🎵 Русский Рок',
    streamUrl: 'http://rock.volna.top/RusRock',
    linkUrl: 'https://rusrock.volna.top/',
  },
  {
    id: 'nature-rain',
    name: '🌧️ Звуки дождя',
    streamUrl: 'https://maggie.torontocast.com:2020/stream/natureradiorain',
  },
  {
    id: 'radio-paradise',
    name: '🌴 Radio Paradise',
    streamUrl: 'https://stream.radioparadise.com/mp3-128',
  },
];
