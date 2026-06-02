import { useCallback, useRef } from 'react';

export function useAudio(src: string) {
  // Cria e mantém a instância do áudio durante todo o ciclo de vida do componente
  const audioRef = useRef<HTMLAudioElement>(new Audio(src));

  const play = useCallback((): void => {
    // Volta o áudio para o início
    audioRef.current.currentTime = 0;

    // Reproduz o áudio
    void audioRef.current.play();
  }, []);

  // Expõe a função para reprodução do áudio
  return { play };
}
