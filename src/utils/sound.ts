const ZAKID_SRC = `${import.meta.env.BASE_URL}zakid.mp3`.replace(/\/\/+/g, '/');

export function playZakid() {
  try {
    const audio = new Audio(ZAKID_SRC);
    audio.volume = 1;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}
