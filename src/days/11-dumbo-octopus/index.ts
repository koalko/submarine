interface DumboPosition {
  x: number;
  y: number;
}

interface Dumbo extends DumboPosition {
  energy: number;
}

type DumboHandler = (dumbo: Dumbo) => void;

// TODO: Redesign, too much fragile stuff
class DumboCavern {
  #width = 0;
  #height = 0;
  #energyMap: number[][] = [];
  #flashCount = 0;
  #flashed = new Set<string>();

  constructor(energyMap: number[][]) {
    this.#height = energyMap.length;
    this.#width = energyMap[0]?.length;
    this.#energyMap = energyMap;
  }

  getDumbo({ x, y }: DumboPosition) {
    return { x, y, energy: this.#energyMap[y][x] };
  }

  resetFlashed() {
    this.#flashed = new Set<string>();
  }

  static getDumboPositionKey({ x, y }: DumboPosition) {
    return `${x}:${y}`;
  }

  addFlashed({ x, y }: DumboPosition) {
    this.#flashed.add(DumboCavern.getDumboPositionKey({ x, y }));
  }

  hasFlashed({ x, y }: DumboPosition) {
    return this.#flashed.has(DumboCavern.getDumboPositionKey({ x, y }));
  }

  incrementEnergy({ x, y }: DumboPosition) {
    this.#energyMap[y][x] += 1;
  }

  incrementFlashCount() {
    this.#flashCount += 1;
  }

  setEnergy({ x, y, energy }: Dumbo) {
    this.#energyMap[y][x] = energy;
  }

  forEach(handle: DumboHandler) {
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        handle(this.getDumbo({ x, y }));
      }
    }
  }

  checkBounds({ x, y }: DumboPosition) {
    return x >= 0 && x < this.#width && y >= 0 && y < this.#height;
  }

  tryFlash({ x, y, energy }: Dumbo) {
    if (energy <= DumboCavern.peakEnergy) return;
    if (this.hasFlashed({ x, y })) return;

    this.addFlashed({ x, y });
    this.incrementFlashCount();

    for (let dx = x - 1; dx <= x + 1; dx += 1) {
      for (let dy = y - 1; dy <= y + 1; dy += 1) {
        if (dx === x && dy === y) continue;
        if (!this.checkBounds({ x: dx, y: dy })) continue;
        this.incrementEnergy({ x: dx, y: dy });
        this.tryFlash(this.getDumbo({ x: dx, y: dy }));
      }
    }
  }

  deenergize({ x, y, energy }: Dumbo) {
    if (energy <= DumboCavern.peakEnergy) return;
    this.setEnergy({ x, y, energy: DumboCavern.initEnergy });
  }

  tick() {
    this.resetFlashed();
    this.forEach(this.incrementEnergy.bind(this));
    this.forEach(this.tryFlash.bind(this));
    this.forEach(this.deenergize.bind(this));
  }

  get hasEverybodyFlashed() {
    return this.#flashed.size === this.#width * this.#height;
  }

  get flashCount() {
    return this.#flashCount;
  }

  static get peakEnergy() {
    return 9;
  }

  static get initEnergy() {
    return 0;
  }

  dump(name: string) {
    console.info(name);
    console.info('');
    for (let y = 0; y < this.#height; y++) {
      console.info(
        this.#energyMap[y]
          .map((energy) => (energy > DumboCavern.peakEnergy ? '*' : energy))
          .join('')
      );
    }
    console.info('');
  }
}

function parse(input: string[]): DumboCavern {
  const map = [];
  let width = null;
  for (const line of input) {
    const row = line.split('').map(Number);
    if (width === null) width = row.length;
    if (width !== row.length)
      throw new Error(`Row length differs from previous rows: ${line}`);
    map.push(row);
  }
  return new DumboCavern(map);
}

function countFlashes(stepCount: number, input: string[]): number {
  const cavern = parse(input);
  for (let stepNo = 0; stepNo < stepCount; stepNo += 1) {
    cavern.tick();
  }
  return cavern.flashCount;
}

function ohSoBright(input: string[]): number {
  const cavern = parse(input);
  let stepNo = 0;
  do {
    cavern.tick();
    stepNo += 1;
  } while (!cavern.hasEverybodyFlashed);
  return stepNo;
}

export { countFlashes, ohSoBright };
