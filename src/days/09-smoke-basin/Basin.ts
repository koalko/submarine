import { HeightMap, HeightPoint } from './HeightMap';

class Basin {
  #basin: Set<string>;

  static key(point: HeightPoint) {
    return `${point.x}:${point.y}`;
  }

  constructor(items: string[] = []) {
    this.#basin = new Set(items);
  }

  has(point: HeightPoint) {
    return this.#basin.has(Basin.key(point));
  }

  add(point: HeightPoint) {
    return this.#basin.add(Basin.key(point));
  }

  get size() {
    return this.#basin.size;
  }

  [Symbol.iterator]() {
    return this.#basin[Symbol.iterator]();
  }
}

class BasinSet {
  #basins: Set<Basin> = new Set();

  find(point: HeightPoint) {
    for (const basin of this.#basins) {
      if (basin.has(point)) {
        return basin;
      }
    }
    return undefined;
  }

  merge(basin1: Basin, basin2: Basin) {
    this.#basins.delete(basin1);
    this.#basins.delete(basin2);
    const basin = new Basin([...basin1, ...basin2]);
    this.#basins.add(basin);
    return basin;
  }

  add() {
    const basin = new Basin();
    this.#basins.add(basin);
    return basin;
  }

  selectBasin(point: HeightPoint) {
    const topBasin = this.find({ ...point, y: point.y - 1 });
    const leftBasin = this.find({ ...point, x: point.x - 1 });
    if (topBasin && leftBasin && topBasin !== leftBasin) {
      return this.merge(topBasin, leftBasin);
    } else if (!topBasin && !leftBasin) {
      return this.add();
    } else if (topBasin) {
      return topBasin;
    } else if (leftBasin) {
      return leftBasin;
    } else {
      throw new Error(
        'Technically not possible, but — no basin to add point to'
      );
    }
  }

  calculate(heightMap: HeightMap) {
    const peakHeight = heightMap.getPeakHeight();
    heightMap.forEach((point) => {
      if (point.height === peakHeight) return;
      const basin = this.selectBasin(point);
      basin.add(point);
    });
  }

  getTopSizes(count: number) {
    return [...this.#basins]
      .map((basin) => basin.size)
      .sort((a, b) => b - a)
      .slice(0, count);
  }
}

export { BasinSet };
