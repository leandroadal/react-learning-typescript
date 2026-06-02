import React, { JSX, useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './buttom';
import { Timer } from './timer';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  // armazena o tempo atual do contador
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  // Controla se o cronômetro está rodando ou parado
  const [timeCounting, setTimeCounting] = React.useState(false);
  // Indica o status do trabalho
  const [working, setWorking] = React.useState(false);

  // Quando working mudar
  useEffect(() => {
    if (working) document.body.classList.add('working');
  }, [working]);

  // Hook personalizado responsável por executar uma função em intervalos
  useInterval(
    () => {
      // Reduz 1 segundo do tempo atual a cada execução
      setMainTime(mainTime - 1);
    },
    // Se o contador estiver ativo, executa a cada 1000ms (1 segundo)
    timeCounting ? 1000 : null,
  );

  const configureWork = () => {
    // Inicia o contador
    setTimeCounting(true);

    // Define que estamos em período de trabalho
    // Muda o estado pro css ser alterado
    setWorking(true);
  };

  return (
    <div className="pomodoro">
      <h2>You are working</h2>

      {/* Componente responsável por exibir o tempo */}
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="teste" onClick={() => console.log(1)}></Button>
        <Button text="teste" onClick={() => console.log(1)}></Button>
      </div>

      <div className="details">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo illo esse
          omnis delectus. Earum deleniti saepe odit amet. At et consequatur cum.
          Optio eligendi perspiciatis perferendis minus beatae nihil fuga!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo illo esse
          omnis delectus. Earum deleniti saepe odit amet. At et consequatur cum.
          Optio eligendi perspiciatis perferendis minus beatae nihil fuga!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo illo esse
          omnis delectus. Earum deleniti saepe odit amet. At et consequatur cum.
          Optio eligendi perspiciatis perferendis minus beatae nihil fuga!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo illo esse
          omnis delectus. Earum deleniti saepe odit amet. At et consequatur cum.
          Optio eligendi perspiciatis perferendis minus beatae nihil fuga!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo illo esse
          omnis delectus. Earum deleniti saepe odit amet. At et consequatur cum.
          Optio eligendi perspiciatis perferendis minus beatae nihil fuga!
        </p>
      </div>
    </div>
  );
}
