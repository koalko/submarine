import { addReduce, fromString, getMagnitude } from './SnailfishNumber';

function calculateFinalSumMagnitude(input: string[]): number {
  let result = null;
  for (const line of input) {
    result = result ? addReduce(result, fromString(line)) : fromString(line);
  }
  return result ? getMagnitude(result) : 0;
}

function calculateLargestSumMagnitude(input: string[]): number {
  let max = 0;
  for (const line1 of input) {
    for (const line2 of input) {
      if (line1 === line2) continue;
      const result = addReduce(fromString(line1), fromString(line2));
      const sum = getMagnitude(result);
      if (sum > max) {
        max = sum;
      }
    }
  }
  return max;
}

export { calculateFinalSumMagnitude, calculateLargestSumMagnitude };
