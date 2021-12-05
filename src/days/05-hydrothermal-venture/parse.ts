import { Vents, VentsOptions } from './vents';

function markVents(
  input: string[],
  options: VentsOptions = Vents.defaultOptions
) {
  const vents = new Vents(options);
  for (const line of input) {
    const [from, to] = line.split(' -> ');
    const [fromX, fromY] = from.split(',').map(Number);
    const [toX, toY] = to.split(',').map(Number);
    vents.addLine({ x: fromX, y: fromY }, { x: toX, y: toY });
  }
  return vents;
}

export { markVents };
