import { markVents } from './parse';

function getOverlapsCount(input: string[]): number {
  const vents = markVents(input);
  return vents.getOverlapsCount(1);
}

function getOverlapsCountWithDiagonals(input: string[]): number {
  const vents = markVents(input, { shouldMarkDiagonals: true });
  return vents.getOverlapsCount(1);
}

export { getOverlapsCount, getOverlapsCountWithDiagonals };
