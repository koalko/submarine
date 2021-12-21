interface Point {
  x: number;
  y: number;
}

interface Range {
  from: number;
  to: number;
}

function getNextPosition(
  point: Point,
  velocity: Point
): { point: Point; velocity: Point } {
  return {
    point: {
      x: point.x + velocity.x,
      y: point.y + velocity.y,
    },
    velocity: {
      x: velocity.x + (velocity.x > 0 ? -1 : velocity.x < 0 ? 1 : 0),
      y: velocity.y - 1,
    },
  };
}

function isPointInRange(point: Point, xRange: Range, yRange: Range) {
  return (
    point.x >= xRange.from &&
    point.x <= xRange.to &&
    point.y >= yRange.from &&
    point.y <= yRange.to
  );
}

function parse(input: string[]): { x: Range; y: Range } {
  const area = input[0];
  const match = area.match(
    /x=(-?[0-9]+)..(-?[0-9]+), y=(-?[0-9]+)..(-?[0-9]+)/
  );
  if (!match || match.length < 5) throw new Error(`Incorrect input: ${area}`);
  const [x1, x2, y1, y2] = match.slice(1, 5).map((s) => Number(s));
  return {
    x: { from: Math.min(x1, x2), to: Math.max(x1, x2) },
    y: { from: Math.min(y1, y2), to: Math.max(y1, y2) },
  };
}

function solve(input: string[]) {
  const range = parse(input);
  let maxY = -Infinity;
  const velocities = [];
  for (let x = 0; x <= 1000; x += 1) {
    for (let y = -100; y <= 100; y += 1) {
      let localMaxY = -Infinity;
      let point = { x: 0, y: 0 };
      let velocity = { x, y };
      for (let stepNo = 0; stepNo < 1000; stepNo += 1) {
        ({ point, velocity } = getNextPosition(point, velocity));
        localMaxY = Math.max(point.y, localMaxY);
        if (point.y > localMaxY) localMaxY = point.y;
        if (isPointInRange(point, range.x, range.y)) {
          velocities.push([x, y]);
          maxY = Math.max(maxY, localMaxY);
          break;
        }
      }
    }
  }
  return { maxY, velocitiesAmount: velocities.length };
}

function findHighestProbeY(input: string[]): number {
  const { maxY } = solve(input);
  return maxY;
}

function countCorrectVelocities(input: string[]): number {
  const { velocitiesAmount } = solve(input);
  return velocitiesAmount;
}

export { findHighestProbeY, countCorrectVelocities };
