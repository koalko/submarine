const brackets = {
  pairs: new Map([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
  ]),
  score: {
    syntax: new Map([
      [')', 3],
      [']', 57],
      ['}', 1197],
      ['>', 25137],
    ]),
    completion: new Map([
      [')', 1],
      [']', 2],
      ['}', 3],
      ['>', 4],
    ]),
  },
};

function getLineSyntaxScore(line: string) {
  const chars = line.split('');
  const buffer: string[] = [];
  for (const char of chars) {
    let closed = brackets.pairs.get(char);
    if (closed) {
      buffer.push(closed);
    } else {
      closed = buffer.pop();
      if (closed !== char) {
        const score = brackets.score.syntax.get(char);
        if (score === undefined) {
          throw new Error(
            `Unexpected character "${char}" in the line "${line}"`
          );
        }
        return score;
      }
    }
  }
  return 0;
}

function getLineCompletionScore(line: string) {
  const chars = line.split('');
  const buffer: string[] = [];
  for (const char of chars) {
    let closed = brackets.pairs.get(char);
    if (closed) {
      buffer.push(closed);
    } else {
      closed = buffer.pop();
      if (closed !== char) {
        return 0;
      }
    }
  }
  return buffer
    .reverse()
    .map((char) => brackets.score.completion.get(char) ?? 0)
    .reduce((sum, score) => sum * 5 + score, 0);
}

function calculateSyntaxScore(input: string[]): number {
  return input.map(getLineSyntaxScore).reduce((sum, score) => sum + score, 0);
}

function calculateCompletionScore(input: string[]): number {
  const sortedScores = input
    .map(getLineCompletionScore)
    .filter((score) => score > 0)
    .sort((score1, score2) => score1 - score2);
  return sortedScores[Math.round((sortedScores.length - 1) / 2)];
}

export { calculateSyntaxScore, calculateCompletionScore };
