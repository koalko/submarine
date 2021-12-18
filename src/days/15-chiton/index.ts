interface Position {
  x: number;
  y: number;
}

class Matrix {
  private data: number[][];
  readonly width: number;
  readonly height: number;

  constructor(data: number[][]) {
    this.width = data[0].length;
    this.height = data.length;
    this.data = data;
  }

  isValidPosition({ x, y }: Position) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  get({ x, y }: Position) {
    return this.isValidPosition({ x, y }) ? this.data[y][x] : null;
  }

  set({ x, y }: Position, value: number) {
    if (this.isValidPosition({ x, y })) {
      this.data[y][x] = value;
    }
  }

  dump(padding: number) {
    console.info('');
    for (let y = 0; y < this.height; y += 1) {
      console.info(
        this.data[y].map((value) => `${value}`.padStart(padding)).join('')
      );
    }
    console.info('');
  }

  static fromSize(width: number, height: number, value: number) {
    return new Matrix(
      new Array(height).fill(0).map(() => new Array(width).fill(value))
    );
  }

  static fromTile(data: number[][], size: number) {
    const width = data[0].length;
    const height = data.length;
    const numbers = new Array(height * size)
      .fill(0)
      .map(() => new Array(width * size).fill(0));
    for (let yTile = 0; yTile < size; yTile++) {
      for (let xTile = 0; xTile < size; xTile++) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const n = data[y][x] + yTile + xTile;

            numbers[yTile * height + y][xTile * width + x] =
              n > 9 ? (n % 10) + 1 : n;
          }
        }
      }
    }
    return new Matrix(numbers);
  }
}

function parse(input: string[], tileSize = 0): Matrix {
  const map = [];
  let width = null;
  for (const line of input) {
    const row = line.split('').map(Number);
    if (width === null) width = row.length;
    if (width !== row.length)
      throw new Error(`Row length differs from previous rows: ${line}`);
    map.push(row);
  }
  return tileSize ? Matrix.fromTile(map, tileSize) : new Matrix(map);
}

function traverse(riskMap: Matrix) {
  const pathMap = Matrix.fromSize(
    riskMap.width,
    riskMap.height,
    Number.MAX_SAFE_INTEGER
  );
  pathMap.set({ x: 0, y: 0 }, 0);

  const maxDistance = 2 * Math.max(pathMap.width, pathMap.height);

  // TODO: Optimize
  const walk = () => {
    let changeCount = 0;
    for (let distance = 0; distance < maxDistance; distance += 1) {
      const [xMin, xMax] =
        distance < pathMap.width
          ? [0, distance]
          : [distance - (pathMap.width - 1), pathMap.width - 1];
      for (let x = xMin; x <= xMax; x += 1) {
        const y = distance - x;
        const minRiskLevel = Math.min(
          pathMap.get({ x: x - 1, y }) ?? Number.MAX_SAFE_INTEGER,
          pathMap.get({ x, y: y - 1 }) ?? Number.MAX_SAFE_INTEGER,
          pathMap.get({ x: x + 1, y }) ?? Number.MAX_SAFE_INTEGER,
          pathMap.get({ x, y: y + 1 }) ?? Number.MAX_SAFE_INTEGER
        );
        const pathRiskLevel = (riskMap.get({ x, y }) ?? 0) + minRiskLevel;
        const oldRiskLevel = pathMap.get({ x, y }) ?? Number.MAX_SAFE_INTEGER;
        if (pathRiskLevel < oldRiskLevel) {
          pathMap.set({ x, y }, pathRiskLevel);
          changeCount += 1;
        }
      }
    }
    return changeCount;
  };

  while (walk() > 0);

  return (
    pathMap.get({ x: riskMap.width - 1, y: riskMap.height - 1 }) ??
    Number.MAX_SAFE_INTEGER
  );
}

function calculateLowestRiskXS(input: string[]): number {
  return traverse(parse(input));
}

function calculateLowestRiskXL(input: string[]): number {
  return traverse(parse(input, 5));
}

export { calculateLowestRiskXS, calculateLowestRiskXL };
