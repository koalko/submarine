import { parseInput } from './parse';

function getBingoFirstWinScore(input: string[]): number {
  const { turns, boards } = parseInput(input);

  for (const number of turns) {
    for (const board of boards) {
      if (board.mark(number)) {
        return board.getScore(number);
      }
    }
  }

  return 0;
}

function getBingoLastWinScore(input: string[]): number {
  const { turns, boards } = parseInput(input);
  let lastScore = 0;

  for (const number of turns) {
    for (const board of boards) {
      if (board.mark(number)) {
        lastScore = board.getScore(number);
        boards.delete(board);
      }
    }
  }

  return lastScore;
}

export { getBingoFirstWinScore, getBingoLastWinScore };
