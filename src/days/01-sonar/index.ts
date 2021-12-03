function countHollows(input: string[]): number {
  let prevDepth: number | null = null;
  let count = 0;
  input.forEach((line) => {
    const depth = Number(line);
    if (prevDepth !== null && depth > prevDepth) count++;
    prevDepth = depth;
  });
  return count;
}

function sumWindow(items: string[], start: number, end: number): number {
  // split + reduce would be prettier (arguably), but this is much more efficient
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += Number(items[i]);
  }
  return sum;
}

function countWindowHollows(input: string[]): number {
  const windowSize = 3;
  let prevSum: number | null = null;
  let count = 0;
  for (let i = windowSize; i <= input.length; i++) {
    const sum = sumWindow(input, i - windowSize, i);
    if (prevSum !== null && sum > prevSum) count++;
    prevSum = sum;
  }
  return count;
}

export { countHollows, countWindowHollows };
