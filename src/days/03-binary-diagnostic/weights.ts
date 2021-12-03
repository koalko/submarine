function getWeights(input: string[]): number[] {
  const bitQty = input[0].length;
  const weights: number[] = new Array(bitQty).fill(0);
  input.forEach((line, lineNo) => {
    if (line.length !== bitQty) {
      throw new Error(
        `Line ${line} at index ${lineNo} has an incorrect length`
      );
    }
    const parts = line.split('');
    parts.forEach((char, charNo) => {
      switch (char) {
        case '0':
          weights[charNo] -= 1;
          break;
        case '1':
          weights[charNo] += 1;
          break;
        default:
          throw new Error(
            `Line ${line} at index ${lineNo} contains an unsupported symbol ${char}`
          );
      }
    });
  });
  return weights;
}

export { getWeights };
