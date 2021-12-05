interface BoardPosition {
  rowNo: number;
  colNo: number;
}

class BingoBoard {
  #width: number;
  #height: number;
  #values: number[][];
  #positions: Map<number, BoardPosition> = new Map();
  #markedNumbers: Set<number> = new Set();
  #rowMarkCounts: number[] = [];
  #colMarkCounts: number[] = [];

  constructor(values: number[][]) {
    this.#width = values[0].length;
    this.#height = values.length;
    this.#values = values; // redundant; just for debugging
    values.forEach((row, rowNo) => {
      row.forEach((value, colNo) => {
        this.#positions.set(value, { rowNo, colNo });
      });
    });
    this.reset();
  }

  reset() {
    this.#markedNumbers = new Set();
    this.#rowMarkCounts = new Array(this.#height).fill(0);
    this.#colMarkCounts = new Array(this.#width).fill(0);
  }

  /**
   * Mark a number on the board (if present)
   * @param number number to mark
   * @returns whether the board has won after this turn
   */
  mark(number: number) {
    const position = this.#positions.get(number);
    if (!position) return false;
    this.#markedNumbers.add(number);
    this.#rowMarkCounts[position.rowNo] += 1;
    this.#colMarkCounts[position.colNo] += 1;
    return (
      this.#rowMarkCounts[position.rowNo] === this.#height ||
      this.#colMarkCounts[position.colNo] === this.#width
    );
  }

  getScore(lastNumber: number) {
    const unmarkedScore = Array.from(this.#positions.keys()).reduce(
      (result, value) =>
        this.#markedNumbers.has(value) ? result : result + value,
      0
    );
    return unmarkedScore * lastNumber;
  }

  debug() {
    const pad = 6;
    this.#values.forEach((row) => {
      const sRow = row
        .map((value) =>
          (this.#markedNumbers.has(value) ? `[${value}]` : `${value}`).padStart(
            pad
          )
        )
        .join('');
      console.info(sRow);
    });
    console.info('-'.repeat(pad * this.#width));
  }
}

export { BingoBoard };
