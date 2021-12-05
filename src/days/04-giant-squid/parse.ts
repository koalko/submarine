import { BingoBoard } from './board';

function parseBoardValues(rows: string[]) {
  const boardValues = [];
  let width = 0;
  for (const row of rows) {
    const rowValues = row
      .split(' ')
      .filter(Boolean)
      .map((n) => parseInt(n));
    if (!width) {
      width = rowValues.length;
    } else if (width !== rowValues.length) {
      throw new Error(`Incorrect row [${row}] length`);
    }
    boardValues.push(rowValues);
  }
  return boardValues;
}

function parseInput(input: string[]): {
  turns: number[];
  boards: Set<BingoBoard>;
} {
  const turns = input[0].split(',').map(Number);
  const boards = new Set<BingoBoard>();
  let boardRows: string[] = [];
  for (let lineNo = 2; lineNo <= input.length; lineNo += 1) {
    const line = input[lineNo];
    if (!line && boardRows.length) {
      boards.add(new BingoBoard(parseBoardValues(boardRows)));
      boardRows = [];
    } else {
      boardRows.push(line);
    }
  }
  return { turns, boards };
}

export { parseInput };
