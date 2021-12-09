import { BasinSet } from './Basin';
import { HeightMap } from './HeightMap';

function parse(input: string[]): HeightMap {
  const map = [];
  let width = null;
  for (const line of input) {
    const row = line.split('').map(Number);
    if (width === null) width = row.length;
    if (width !== row.length)
      throw new Error(`Row length differs from previous rows: ${line}`);
    map.push(row);
  }
  return new HeightMap(map);
}

function getLargestBasinsSize(count: number, input: string[]): number {
  const heightMap = parse(input);
  const basinSet = new BasinSet();
  basinSet.calculate(heightMap);
  return basinSet.getTopSizes(count).reduce((sum, size) => sum * size, 1);
}

function getLowPointsRiskLevel(input: string[]): number {
  const heightMap = parse(input);
  let sum = 0;
  heightMap.forEach((point) => {
    const neighborHeights = heightMap.getNeighborHeights(point);
    if (point.height < Math.min(...neighborHeights)) {
      sum += point.height + 1;
    }
  });
  return sum;
}

export { getLowPointsRiskLevel, getLargestBasinsSize };
