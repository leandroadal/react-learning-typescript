import { zeroLeft } from './zero-left';

export function secondsToMinutes(seconds: number) {
  // Minuto
  const mm = zeroLeft((seconds / 60) % 60);
  // Segundo
  const ss = zeroLeft((seconds % 60) % 60);
  return `${mm}:${ss}`;
}
