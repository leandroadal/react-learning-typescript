# Pomodoro Timer

Projeto criado para acompanhar e praticar os conceitos de React + TypeScript curso de  **JavaScript e TypeScript do básico ao avançado**, ministrado por Luiz Otávio Miranda na Udemy.

Este projeto implementa a técnica Pomodoro utilizando React e TypeScript. O objetivo é alternar automaticamente entre períodos de trabalho e descanso, auxiliando na manutenção do foco e da produtividade.

A aplicação controla o tempo de cada sessão, contabiliza ciclos concluídos, registra o tempo total trabalhado e exibe estatísticas de uso.

---

## Como funciona

O timer é baseado em três estados principais:

* **Trabalho (Working)**: período dedicado à execução de tarefas.
* **Descanso Curto (Short Rest)**: intervalo realizado após cada pomodoro.
* **Descanso Longo (Long Rest)**: intervalo realizado após a conclusão de todos os ciclos configurados.

O fluxo segue a sequência:

```text
Trabalho
   ↓
Descanso Curto
   ↓
Trabalho
   ↓
Descanso Curto
   ↓
...
   ↓
Descanso Longo
   ↓
Reinicia os ciclos
```

---

## Estados Utilizados

### mainTime

Armazena o tempo atual do cronômetro em segundos.

```ts
const [mainTime, setMainTime] = useState(props.pomodoroTime);
```

---

### timeCounting

Controla se o cronômetro está executando ou pausado.

```ts
const [timeCounting, setTimeCounting] = useState(false);
```

---

### working

Indica se o usuário está em período de trabalho.

```ts
const [working, setWorking] = useState(false);
```

---

### resting

Indica se o usuário está em período de descanso.

```ts
const [resting, setResting] = useState(false);
```

---

### cyclesQtdManager

Controla quantos ciclos de trabalho ainda faltam antes de iniciar um descanso longo.

```ts
const [cyclesQtdManager, setCyclesQtdManager] = useState(
  new Array(props.cycles - 1).fill(true),
);
```

Exemplo:

Se o número de ciclos configurado for 4:

```ts
[true, true, true]
```

A cada pomodoro concluído um item é removido:

```ts
[true, true, true]
[true, true]
[true]
[]
```

Quando o array fica vazio, o próximo descanso será longo.

---

### completedCycles

Quantidade de ciclos completos concluídos.

```ts
const [completedCycles, setCompletedCycles] = useState(0);
```

---

### fullWorkingTime

Tempo total trabalhado acumulado em segundos.

```ts
const [fullWorkingTime, setFullWorkingTime] = useState(0);
```

---

### numberOfPomodoros

Quantidade total de pomodoros concluídos.

```ts
const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);
```

---

## Controle do Cronômetro

O contador é executado através do hook customizado `useInterval`.

```ts
useInterval(
  () => {
    setMainTime((prevTime) => prevTime - 1);

    if (working) {
      setFullWorkingTime((prevTime) => prevTime + 1);
    }
  },
  timeCounting ? 1000 : null,
);
```

Quando o cronômetro está ativo:

* O tempo restante é reduzido em um segundo.
* O tempo total trabalhado é incrementado durante os períodos de trabalho.

Quando `timeCounting` é `false`, o intervalo é interrompido.

---

## Iniciando um Período de Trabalho

A função `configureWork` prepara o sistema para uma nova sessão de trabalho.

```ts
const configureWork = useCallback(() => {
  setTimeCounting(true);
  setWorking(true);
  setResting(false);
  setMainTime(props.pomodoroTime);

  startSound.play();
}, [props.pomodoroTime, startSound]);
```

---

## Iniciando um Período de Descanso

A função `configureRest` configura o descanso curto ou longo.

```ts
const configureRest = useCallback(
  (long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    if (long) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }

    stopSound.play();
  },
  [props.longRestTime, props.shortRestTime, stopSound],
);
```

---

## Estatísticas

A aplicação exibe três métricas principais:

### Ciclos concluídos

Quantidade de ciclos completos finalizados.

```ts
<p>Ciclos concluídos: {completedCycles}</p>
```

---

### Tempo total trabalhado

Tempo acumulado em sessões de trabalho.

```ts
<p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
```

---

### Pomodoros concluídos

Quantidade total de sessões de trabalho concluídas.

```ts
<p>Pomodoros concluídos: {numberOfPomodoros}</p>
```

---

## Sons de Notificação

Dois efeitos sonoros são utilizados:

* `bell-start.mp3` para indicar o início de uma sessão de trabalho.
* `bell-finish.mp3` para indicar o início de um período de descanso.

A reprodução é realizada através do hook customizado `useAudio`.

---
