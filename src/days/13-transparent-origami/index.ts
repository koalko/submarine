interface Point {
  x: number;
  y: number;
}

interface Fold {
  direction: string; // todo: enum
  amount: number;
}

interface Task {
  points: Set<string>;
  folds: Fold[];
}

type PointFolder = ({ x, y }: Point) => Point;

const point2key = ({ x, y }: Point): string => `${x}:${y}`;
const key2point = (key: string): Point => {
  const [x, y] = key.split(':').map(Number);
  return { x, y };
};

function parse(input: string[]): Task {
  const points = new Set<string>();
  const folds: Fold[] = [];
  for (const line of input) {
    if (line.startsWith('fold')) {
      const [direction, amount] = line.replace('fold along ', '').split('=');
      folds.push({ direction, amount: Number(amount) });
    } else if (line.includes(',')) {
      const [x, y] = line.split(',').map(Number);
      points.add(point2key({ x, y }));
    }
  }
  return { points, folds };
}

function foldWith(points: Set<string>, folder: PointFolder) {
  const foldedPoints = new Set<string>();
  for (const key of points) {
    const { x, y } = key2point(key);
    const point = folder({ x, y });
    foldedPoints.add(point2key(point));
  }
  return foldedPoints;
}

function foldIt(points: Set<string>, fold: Fold) {
  switch (fold.direction) {
    case 'x':
      return foldWith(points, ({ x, y }) =>
        x > fold.amount ? { x: 2 * fold.amount - x, y } : { x, y }
      );
    case 'y':
      return foldWith(points, ({ x, y }) =>
        y > fold.amount ? { x, y: 2 * fold.amount - y } : { x, y }
      );
    default:
      return points;
  }
}

function print({ points }: Task) {
  const max: Point = { x: 0, y: 0 };
  for (const key of points) {
    const { x, y } = key2point(key);
    if (x > max.x) max.x = x;
    if (y > max.y) max.y = y;
  }
  for (let y = 0; y <= max.y; y += 1) {
    const line = [];
    for (let x = 0; x <= max.x; x += 1) {
      line.push(points.has(point2key({ x, y })) ? '#' : '.');
    }
    console.info(line.join(''));
  }
}

function foldOnce(input: string[]): number {
  const { points, folds } = parse(input);
  const foldedPoints = foldIt(points, folds[0]);
  return foldedPoints.size;
}

function foldAllTheWay(input: string[]): number {
  const { points, folds } = parse(input);
  let foldedPoints = points;
  for (const fold of folds) {
    foldedPoints = foldIt(foldedPoints, fold);
  }
  print({ points: foldedPoints, folds });
  return foldedPoints.size;
}

export { foldOnce, foldAllTheWay };
