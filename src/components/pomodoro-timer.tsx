import { JSX, useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { useAudio } from '../hooks/use-audio';
import { secondsToTime } from '../utils/seconds-to-time';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  // armazena o tempo atual do contador
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  // Controla se o cronômetro está rodando ou parado
  const [timeCounting, setTimeCounting] = useState(false);
  // Indica o status do trabalho
  const [working, setWorking] = useState(false);
  // Indica se esta no período de descanso
  const [resting, setResting] = useState(false);
  // Controla quantos ciclos de trabalho ainda faltam antes do descanso longo
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  // Quantidade de ciclos completos concluídos
  const [completedCycles, setCompletedCycles] = useState(0);
  // Tempo total trabalhado em segundos
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  // Quantidade total de pomodoros concluídos
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  // Hooks responsáveis pela reprodução dos sons
  const startSound = useAudio(bellStart);
  const stopSound = useAudio(bellFinish);

  // Hook personalizado responsável por executar uma função em intervalos
  useInterval(
    () => {
      // Reduz 1 segundo do tempo atual a cada execução
      setMainTime(mainTime - 1);

      // Registra o tempo total trabalhado
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    // Se o contador estiver ativo, executa a cada 1000ms (1 segundo)
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    // Inicia o contador
    setTimeCounting(true);

    // Define que estamos em período de trabalho
    // Muda o estado pro css ser alterado
    setWorking(true);

    setResting(false);

    // Restaura o tempo
    setMainTime(props.pomodoroTime);

    // Toca um audio quando inicia o período de trabalho
    startSound.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      // Inicia o contador
      setTimeCounting(true);

      // Define que não estamos em período de trabalho
      setWorking(false);
      /// Define que estamos descansando
      setResting(true);

      if (long) {
        // Define como o tempo de descanso longo
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }

      // Toca um audio quando inicia o descanso
      stopSound.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  // Controla as transições automáticas entre trabalho e descanso
  // Quando working mudar
  useEffect(() => {
    // Aplica uma classe CSS ao body durante o trabalho
    if (working) document.body.classList.add('working');
    // Remove durante o descanso
    if (resting) document.body.classList.remove('working');

    // Garante que as próximas instruções so acontecem dse o tempo acabar
    if (mainTime > 0) return;

    // Quando um pomodoro termina e ainda existem ciclos restantes
    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      // Diminui um ciclo
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      // Inicia o descanso longo
      configureRest(true);
      // Reinicia o contador de ciclos
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));

      // Incrementa os ciclos completos - para a seção de details mostrar
      setCompletedCycles(completedCycles + 1);
    }

    // Conta mais um pomodoro concluído
    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    // Quando o descanso termina, inicia automaticamente um novo trabalho
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    configureRest,
    configureWork,
    setCyclesQtdManager,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are {working ? 'Working' : 'Resting'}</h2>

      {/* Componente responsável por exibir o tempo */}
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        {/* Se o timer não estiver ativo com estado working ou resting o botão de play/pause some*/}
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        {/* Estatísticas do Pomodoro */}
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
