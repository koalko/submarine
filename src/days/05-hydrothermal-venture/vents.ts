interface Point {
  x: number;
  y: number;
}

interface VentsOptions {
  shouldMarkDiagonals: boolean;
}

class Vents {
  #positions: Map<string, number> = new Map();
  #max: Point = { x: 0, y: 0 };
  #options: VentsOptions;

  static defaultOptions: VentsOptions = { shouldMarkDiagonals: false };

  constructor(options: VentsOptions = Vents.defaultOptions) {
    this.#options = options;
  }

  getPointKey(point: Point) {
    return `${point.x}:${point.y}`;
  }

  addPoint(point: Point) {
    const key = this.getPointKey(point);
    const value = this.#positions.get(key) ?? 0;
    this.#positions.set(key, value + 1);
  }

  getPointValue(point: Point) {
    const key = this.getPointKey(point);
    return this.#positions.get(key);
  }

  addLine(from: Point, to: Point) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx !== 0 && dy !== 0) {
      if (!this.#options.shouldMarkDiagonals) return;
      if (Math.abs(dx) !== Math.abs(dy)) return; // 45° only
    }
    this.#max.x = Math.max(this.#max.x, from.x, to.x);
    this.#max.y = Math.max(this.#max.y, from.y, to.y);
    const stepCount = Math.max(Math.abs(dx), Math.abs(dy)) + 1;
    const sx = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const sy = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    for (let stepNo = 0, x = from.x, y = from.y; stepNo < stepCount; stepNo++) {
      this.addPoint({ x, y });
      x += sx;
      y += sy;
    }
  }

  getOverlapsCount(threshold: number) {
    return Array.from(this.#positions.values()).reduce(
      (result, value) => (value > threshold ? result + 1 : result),
      0
    );
  }

  debug() {
    console.info('');
    for (let y = 0; y <= this.#max.y; y++) {
      const line = [];
      for (let x = 0; x <= this.#max.x; x++) {
        line.push(this.getPointValue({ x, y }) ?? '.');
      }
      console.info(line.join(''));
    }
    console.info('');
  }
}

export { Vents, VentsOptions };
