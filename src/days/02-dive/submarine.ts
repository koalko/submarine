const actions = ['forward', 'down', 'up'] as const;
type Action = typeof actions[number];

function isValidAction(value: string): value is Action {
  return actions.includes(value as Action);
}

type ActionHandler = (amount: number) => void;

interface AbstractSubmarine {
  handle(action: Action, amount: number): void;
  report(): number;
}

class SimpleSubmarine implements AbstractSubmarine {
  #position = 0;
  #depth = 0;

  #actions: { [key in Action]: ActionHandler } = {
    forward: (amount) => (this.#position += amount),
    down: (amount) => (this.#depth += amount),
    up: (amount) => (this.#depth -= amount),
  };

  handle(action: Action, amount: number) {
    this.#actions[action](amount);
  }

  report() {
    return this.#position * this.#depth;
  }
}

class ImprovedSubmarine implements AbstractSubmarine {
  #position = 0;
  #depth = 0;
  #aim = 0;

  #actions: { [key in Action]: ActionHandler } = {
    forward: (amount) => {
      this.#position += amount;
      this.#depth += this.#aim * amount;
    },
    down: (amount) => (this.#aim += amount),
    up: (amount) => (this.#aim -= amount),
  };

  handle(action: Action, amount: number) {
    this.#actions[action](amount);
  }

  report() {
    return this.#position * this.#depth;
  }
}

export { AbstractSubmarine, SimpleSubmarine, ImprovedSubmarine, isValidAction };
