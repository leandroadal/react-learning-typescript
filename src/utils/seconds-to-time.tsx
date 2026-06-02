export function secondsToTime(seconds: number) {
  const zeroLeft = (n: number) => Math.floor(n).toString().padStart(2, '0');

  // Minuto
  const mm = zeroLeft((seconds / 60) % 60);
  // Segundo
  const ss = zeroLeft((seconds % 60) % 60);
  return `${mm}:${ss}`;
}
