interface Point {
  x: number;
  y: number;
  z: number;
}

type PointKey = string;
type BeaconMap = Map<number, Point[]>;

function getDistance(pointFrom: Point, pointTo: Point): Point {
  return {
    x: pointFrom.x - pointTo.x,
    y: pointFrom.y - pointTo.y,
    z: pointFrom.z - pointTo.z,
  };
}

const getManhattanDistance = (pointFrom: Point, pointTo: Point) =>
  Math.abs(pointFrom.x - pointTo.x) +
  Math.abs(pointFrom.y - pointTo.y) +
  Math.abs(pointFrom.z - pointTo.z);

// TODO: Formalize
const getRotations = ({ x, y, z }: Point): Point[] => [
  // z+
  { x: x, y: y, z: z },
  { x: y, y: -x, z: z },
  { x: -x, y: -y, z: z },
  { x: -y, y: x, z: z },
  // z-
  { x: -x, y: y, z: -z },
  { x: y, y: x, z: -z },
  { x: x, y: -y, z: -z },
  { x: -y, y: -x, z: -z },
  // x+
  { x: -z, y: y, z: x },
  { x: y, y: z, z: x },
  { x: z, y: -y, z: x },
  { x: -y, y: -z, z: x },
  // x-
  { x: z, y: y, z: -x },
  { x: y, y: -z, z: -x },
  { x: -z, y: -y, z: -x },
  { x: -y, y: z, z: -x },
  // y+
  { x: z, y: x, z: y },
  { x: x, y: -z, z: y },
  { x: -z, y: -x, z: y },
  { x: -x, y: z, z: y },
  // y-
  { x: -z, y: x, z: -y },
  { x: x, y: z, z: -y },
  { x: z, y: -x, z: -y },
  { x: -x, y: -z, z: -y },
];

const rotationsCount = getRotations({ x: 0, y: 0, z: 0 }).length;

const point2key = ({ x, y, z }: Point): PointKey => `${x}:${y}:${z}`;
const key2point = (key: PointKey): Point => {
  const [x, y, z] = key.split(':').map(Number);
  return { x, y, z };
};

function shift(point: Point, distance: Point): Point {
  return {
    x: point.x + distance.x,
    y: point.y + distance.y,
    z: point.z + distance.z,
  };
}

function parse(input: string[]): BeaconMap {
  let scannerNo = -1;
  const beaconMap: BeaconMap = new Map();
  for (const line of input) {
    if (line.length === 0) {
      continue;
    } else if (line.startsWith('--- scanner ')) {
      scannerNo = Number(line.split(' ')[2]);
    } else {
      const [x, y, z] = line.split(',').map(Number);
      beaconMap.set(
        scannerNo,
        (beaconMap.get(scannerNo) ?? []).concat([{ x, y, z }])
      );
    }
  }
  return beaconMap;
}

function addToPointKeySet(pointKeySet: Set<PointKey>, points: Point[]) {
  for (const point of points) {
    pointKeySet.add(point2key(point));
  }
}

// TODO: Optimize
function rebaseScanners(input: string[]) {
  const scanners = parse(input);

  const uniqueBeacons = new Set<string>();
  const base = scanners.get(0);
  if (!base) throw new Error('Unable to locate beacons for scanner 0');
  const rebasedScanners: BeaconMap = new Map();
  rebasedScanners.set(0, [...base]);

  addToPointKeySet(uniqueBeacons, rebasedScanners.get(0) ?? []);

  const scannerCoordinates: Map<number, Point> = new Map();
  scannerCoordinates.set(0, { x: 0, y: 0, z: 0 });

  while (rebasedScanners.size !== scanners.size) {
    let found = false;
    for (const [isolatedScannerNo, isolatedBeacons] of scanners) {
      for (const [rebasedScannerNo, rebasedBeacons] of rebasedScanners) {
        if (rebasedScanners.get(isolatedScannerNo)) continue;
        const isolatedScannerRotations = isolatedBeacons.map(getRotations);
        for (let rotationNo = 0; rotationNo < rotationsCount; rotationNo += 1) {
          const distances = new Map<PointKey, number>();
          for (const rebasedBeacon of rebasedBeacons) {
            for (const isolatedBeaconRotations of isolatedScannerRotations) {
              const isolatedBeacon = isolatedBeaconRotations[rotationNo];
              const distanceKey = point2key(
                getDistance(rebasedBeacon, isolatedBeacon)
              );
              distances.set(distanceKey, (distances.get(distanceKey) ?? 0) + 1);
            }
          }
          for (const [distanceKey, distanceCount] of distances) {
            if (distanceCount === 12) {
              /*console.info(
                `scanner ${isolatedScannerNo} ←→ scanner ${rebasedScannerNo}, rotation ${rotationNo}, distance ${distanceKey}`
              );*/
              const distance = key2point(distanceKey);
              scannerCoordinates.set(isolatedScannerNo, distance);
              rebasedScanners.set(
                isolatedScannerNo,
                isolatedScannerRotations.map((rotations) =>
                  shift(rotations[rotationNo], distance)
                )
              );
              addToPointKeySet(
                uniqueBeacons,
                rebasedScanners.get(isolatedScannerNo) ?? []
              );
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
    }
    if (!found) {
      throw new Error(
        `Unable to find connected scanners; there are still ${
          scanners.size - rebasedScanners.size
        } isolated scanners`
      );
    }
  }

  return { scannerCoordinates, uniqueBeacons };
}

function countBeacons(input: string[]): number {
  const { uniqueBeacons } = rebaseScanners(input);
  return uniqueBeacons.size;
}

function getMaxManhattanDistance(input: string[]): number {
  const { scannerCoordinates } = rebaseScanners(input);
  const coords = [...scannerCoordinates.values()];
  const distances = [];
  for (let from = 0; from < coords.length - 1; from += 1) {
    for (let to = from + 1; to < coords.length; to += 1) {
      distances.push(getManhattanDistance(coords[from], coords[to]));
    }
  }
  return Math.max(...distances);
}

export { countBeacons, getMaxManhattanDistance };
