import { Tree } from './tree';
import { getWeights } from './weights';

function getPowerConsumption(input: string[]): number {
  const weights = getWeights(input);
  // Might just map/join to string of '1's / '0's and parseInt(..., 2),
  // but this seems more interesting:
  const gamma = weights.reduce((gamma, weight) => {
    return (gamma << 1) | (weight > 0 ? 1 : 0);
  }, 0);
  const epsilon = weights.reduce((gamma, weight) => {
    return (gamma << 1) | (weight > 0 ? 0 : 1);
  }, 0);
  return gamma * epsilon;
}

function getLifeSupportRating(input: string[]): number {
  const tree = new Tree();

  input.forEach((line) => {
    tree.add(line.split(''));
  });

  const o2 = tree.getMostCommonPath().join('');
  const co2 = tree.getLeastCommonPath().join('');

  return parseInt(o2, 2) * parseInt(co2, 2);
}

export { getPowerConsumption, getLifeSupportRating };
