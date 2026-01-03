export function formatTon(amount: number): string {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

export function formatFish(amount: number): string {
  return Math.round(amount).toLocaleString('ru-RU');
}

