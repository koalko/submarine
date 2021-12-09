interface HeightPoint {
  x: number;
  y: number;
  height: number;
}

type HeightPointHandler = (point: HeightPoint) => void;

class HeightMap {
  #width = 0;
  #height = 0;
  #map: number[][] = [];

  constructor(map: number[][]) {
    this.#height = map.length;
    this.#width = map[0]?.length;
    this.#map = map;
  }

  forEach(handle: HeightPointHandler) {
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        handle({ x, y, height: this.#map[y][x] });
      }
    }
  }

  getNeighborHeights(point: HeightPoint): number[] {
    const set = new Set<number>();
    if (point.y > 0) set.add(this.#map[point.y - 1][point.x]);
    if (point.y + 1 < this.#height) set.add(this.#map[point.y + 1][point.x]);
    if (point.x > 0) set.add(this.#map[point.y][point.x - 1]);
    if (point.x + 1 < this.#width) set.add(this.#map[point.y][point.x + 1]);
    return [...set];
  }

  getPeakHeight() {
    return 9;
  }
}

export { HeightPoint, HeightMap };
