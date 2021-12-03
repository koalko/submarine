import {
  AbstractSubmarine,
  ImprovedSubmarine,
  isValidAction,
  SimpleSubmarine,
} from './submarine';

function dive(submarine: AbstractSubmarine, input: string[]): number {
  input.forEach((line, index) => {
    const [action, amount] = line.split(' ');
    if (!isValidAction(action)) {
      throw new Error(`Illegal action "${action}" on line ${index}`);
    }
    submarine.handle(action, Number(amount));
  });
  return submarine.report();
}

const justDive = dive.bind(null, new SimpleSubmarine());
const diveHarder = dive.bind(null, new ImprovedSubmarine());

export { justDive, diveHarder };
