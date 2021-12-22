interface Point3D {
  x: number;
  y: number;
  z: number;
}

enum RangeType {
  Generic,
  Intersect,
  Diff,
}

interface Range {
  from: number;
  to: number;
  type: RangeType;
}

interface Range3D {
  x: Range;
  y: Range;
  z: Range;
}

interface Command {
  block: Range3D;
  on: boolean;
}

const point3d2key = (point: Point3D) => `${point.x}:${point.y}:${point.z}`;

const areRangesIntersect = (range1: Range, range2: Range) => {
  return range1.from >= range2.from
    ? range2.to >= range1.from
    : range1.to >= range2.from;
};

const areRanges3DIntersect = (range1: Range3D, range2: Range3D) =>
  areRangesIntersect(range1.x, range2.x) &&
  areRangesIntersect(range1.y, range2.y) &&
  areRangesIntersect(range1.z, range2.z);

const intersectRanges = (range1: Range, range2: Range): Range => {
  return {
    from: Math.max(range1.from, range2.from),
    to: Math.min(range1.to, range2.to),
    type: RangeType.Intersect,
  };
};

const diffRanges = (range1: Range, range2: Range): Range[] => {
  const diff: Range[] = [];
  if (range2.from > range1.from)
    diff.push({
      from: range1.from,
      to: range2.from - 1,
      type: RangeType.Diff,
    });
  if (range1.to > range2.to)
    diff.push({
      from: range2.to + 1,
      to: range1.to,
      type: RangeType.Diff,
    });
  return diff;
};

const diffPlusIntersectRanges = (range1: Range, range2: Range): Range[] =>
  diffRanges(range1, range2).concat([intersectRanges(range1, range2)]);

const diffRanges3D = (range1: Range3D, range2: Range3D) => {
  const xSplit = diffPlusIntersectRanges(range1.x, range2.x);
  const ySplit = diffPlusIntersectRanges(range1.y, range2.y);
  const zSplit = diffPlusIntersectRanges(range1.z, range2.z);
  const ranges: Range3D[] = [];
  for (const xRange of xSplit) {
    for (const yRange of ySplit) {
      for (const zRange of zSplit) {
        // Skipping the intersecting 3D-range:
        if (
          xRange.type === RangeType.Intersect &&
          yRange.type === RangeType.Intersect &&
          zRange.type === RangeType.Intersect
        )
          continue;
        // Adding the diff 3D-range:
        ranges.push({
          x: { from: xRange.from, to: xRange.to, type: RangeType.Generic },
          y: { from: yRange.from, to: yRange.to, type: RangeType.Generic },
          z: { from: zRange.from, to: zRange.to, type: RangeType.Generic },
        });
      }
    }
  }
  return ranges;
};

const getVolume = (block: Range3D) =>
  (block.x.to - block.x.from + 1) *
  (block.y.to - block.y.from + 1) *
  (block.z.to - block.z.from + 1);

function parse(input: string[]): Command[] {
  return input.map((line) => {
    const match = line.match(
      /^(?<state>on|off) x=(?<xFrom>-?[0-9]+)\.\.(?<xTo>-?[0-9]+),y=(?<yFrom>-?[0-9]+)\.\.(?<yTo>-?[0-9]+),z=(?<zFrom>-?[0-9]+)\.\.(?<zTo>-?[0-9]+)$/
    );
    if (!match || !match.groups)
      throw new Error(`Unable to parse the line "${line}"`);
    const x = {
      from: Number(match.groups.xFrom),
      to: Number(match.groups.xTo),
      type: RangeType.Generic,
    };
    if (x.from > x.to) {
      [x.from, x.to] = [x.to, x.from];
    }
    const y = {
      from: Number(match.groups.yFrom),
      to: Number(match.groups.yTo),
      type: RangeType.Generic,
    };
    if (y.from > y.to) {
      [y.from, y.to] = [y.to, y.from];
    }
    const z = {
      from: Number(match.groups.zFrom),
      to: Number(match.groups.zTo),
      type: RangeType.Generic,
    };
    if (z.from > z.to) {
      [z.from, z.to] = [z.to, z.from];
    }
    return {
      block: {
        x,
        y,
        z,
      },
      on: match.groups.state === 'on',
    };
  });
}

function rebootTheReactorRedux(input: string[]): number {
  const commands = parse(input);
  const points: Set<string> = new Set();
  const limitBottom = (coord: number) => (coord < -50 ? -50 : coord);
  const limitTop = (coord: number) => (coord > 50 ? 50 : coord);
  commands.forEach((command) => {
    for (
      let x = limitBottom(command.block.x.from);
      x <= limitTop(command.block.x.to);
      x += 1
    ) {
      for (
        let y = limitBottom(command.block.y.from);
        y <= limitTop(command.block.y.to);
        y += 1
      ) {
        for (
          let z = limitBottom(command.block.z.from);
          z <= limitTop(command.block.z.to);
          z += 1
        ) {
          const key = point3d2key({ x, y, z });
          if (command.on) {
            points.add(key);
          } else {
            points.delete(key);
          }
        }
      }
    }
  });
  return points.size;
}

function rebootTheReactor(input: string[]): number {
  const commands = parse(input);
  const blocks: Set<Range3D> = new Set();

  const turnOn = (cmdBlock: Range3D) => {
    const blocksToAdd: Set<Range3D> = new Set([cmdBlock]);
    for (const block of blocks) {
      for (const blockToAdd of blocksToAdd) {
        if (areRanges3DIntersect(blockToAdd, block)) {
          diffRanges3D(blockToAdd, block).forEach((splitBlock) =>
            blocksToAdd.add(splitBlock)
          );
          blocksToAdd.delete(blockToAdd);
        }
      }
    }
    for (const blockToAdd of blocksToAdd) {
      blocks.add(blockToAdd);
    }
  };

  const turnOff = (cmdBlock: Range3D) => {
    for (const block of blocks) {
      if (areRanges3DIntersect(cmdBlock, block)) {
        const diff = diffRanges3D(block, cmdBlock);
        diff.forEach((splitBlock) => blocks.add(splitBlock));
        blocks.delete(block);
      }
    }
  };

  for (const command of commands) {
    if (command.on) {
      turnOn(command.block);
    } else {
      turnOff(command.block);
    }
  }

  return [...blocks].reduce((volume, block) => volume + getVolume(block), 0);
}

export { rebootTheReactorRedux, rebootTheReactor };
