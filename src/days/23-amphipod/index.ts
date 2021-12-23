type Maze = string[]; // TODO: Better data structure

type Position = {
  x: number;
  y: number;
};

type Move = {
  maze: Maze;
  energy: number;
};

type State = {
  cache: { [key: string]: boolean };
  minEnergy: number;
  winMoves: Move[];
};

const HallwayBeginX = 0;
const HallwayEndX = 12;
const HallwayY = 1;
const RoomTopY = 2;
const getRoomBottomY = (maze: Maze) => maze.length - 2;
const Empty = '.';
const AmphipodTypes = ['A', 'B', 'C', 'D'];
const OwnRoomXs: { [key: string]: number } = {
  A: 3,
  B: 5,
  C: 7,
  D: 9,
};
const EnergyPerTurn: { [key: string]: number } = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};
const ForbiddenHallwayXs = [3, 5, 7, 9];

const setCharAt = (string: string, index: number, char: string) =>
  index < string.length
    ? string.substring(0, index) + char + string.substring(index + 1)
    : string;

const isInRoom = ({ y }: Position) => y > HallwayY;
const isInHallway = ({ y }: Position) => y === HallwayY;

const canMoveOut = (maze: Maze, { x, y }: Position) => {
  if (maze[y - 1][x] !== Empty) return false;
  const RoomBottomY = getRoomBottomY(maze);
  for (let ys = y; ys <= RoomBottomY; ys += 1) {
    if (OwnRoomXs[maze[ys][x]] !== x) {
      return true;
    }
  }
  return false;
};

const canMoveIn = (maze: Maze, amphipodType: string) => {
  const ownRoomX = OwnRoomXs[amphipodType];
  const RoomBottomY = getRoomBottomY(maze);
  for (let ys = RoomTopY; ys <= RoomBottomY; ys += 1) {
    if (![Empty, amphipodType].includes(maze[ys][ownRoomX])) {
      return false;
    }
  }
  return true;
};

const listHallwayMoves = (maze: Maze, { x, y }: Position): Move[] => {
  if (isInHallway({ x, y })) return [];
  const amphipodType = maze[y][x];
  if (!canMoveOut(maze, { x, y })) return [];
  const energyToClimb = (y - RoomTopY) * EnergyPerTurn[amphipodType];

  const moves: Move[] = [];

  const move = (xs: number) => {
    if (maze[HallwayY][xs] !== Empty) return false;
    energy += EnergyPerTurn[amphipodType];
    if (ForbiddenHallwayXs.includes(xs)) return true;
    const nextMaze = [...maze];
    nextMaze[y] = setCharAt(nextMaze[y], x, Empty);
    nextMaze[HallwayY] = setCharAt(nextMaze[HallwayY], xs, amphipodType);
    moves.push({
      maze: nextMaze,
      energy,
    });
    return true;
  };

  let energy = energyToClimb;
  for (let xs = x; xs < HallwayEndX; xs += 1) {
    if (!move(xs)) break;
  }
  energy = energyToClimb;
  for (let xs = x; xs > HallwayBeginX; xs -= 1) {
    if (!move(xs)) break;
  }

  return moves;
};

const listRoomMoves = (maze: Maze, { x, y }: Position): Move[] => {
  const RoomBottomY = getRoomBottomY(maze);
  if (isInRoom({ x, y })) return [];
  const amphipodType = maze[y][x];
  const ownRoomX = OwnRoomXs[amphipodType];
  if (!canMoveIn(maze, amphipodType)) return [];
  let energy = 0;
  const inc = x > ownRoomX ? -1 : 1;
  let isHallwayFree = true;
  for (let xs = x; xs != ownRoomX; xs += inc) {
    energy += EnergyPerTurn[amphipodType];
    if (maze[HallwayY][xs + inc] !== Empty) {
      isHallwayFree = false;
      break;
    }
  }
  if (!isHallwayFree) return [];
  let roomY = RoomBottomY;
  while (maze[roomY][ownRoomX] !== Empty) {
    roomY -= 1;
  }
  if (roomY < RoomTopY) return [];
  energy += (roomY - HallwayY) * EnergyPerTurn[amphipodType];
  const nextMaze = [...maze];
  nextMaze[y] = setCharAt(nextMaze[y], x, Empty);
  nextMaze[roomY] = setCharAt(nextMaze[roomY], ownRoomX, amphipodType);
  return [
    {
      maze: nextMaze,
      energy,
    },
  ];
};

const isMazeSolved = (maze: Maze) => {
  const RoomBottomY = getRoomBottomY(maze);
  return AmphipodTypes.every((amphipodType) => {
    for (let ys = RoomTopY; ys <= RoomBottomY; ys += 1) {
      if (maze[ys][OwnRoomXs[amphipodType]] !== amphipodType) return false;
    }
    return true;
  });
};

function turn(state: State, maze: Maze, energy: number, history: Move[]) {
  const cacheKey = `${maze.join('')}:${energy}`;
  if (state.cache[cacheKey]) return;
  state.cache[cacheKey] = true;
  if (isMazeSolved(maze)) {
    if (energy < state.minEnergy) {
      state.winMoves = history;
      state.minEnergy = energy;
    }
    return;
  }
  for (let y = 0; y < maze.length; y += 1) {
    for (let x = 0; x < maze[y].length; x += 1) {
      const c = maze[y][x];
      if (!AmphipodTypes.includes(c)) continue;
      const moves = isInRoom({ x, y })
        ? listHallwayMoves(maze, { x, y })
        : listRoomMoves(maze, { x, y });
      if (!moves.length) continue;
      for (const move of moves) {
        turn(state, move.maze, energy + move.energy, [...history, move]);
      }
    }
  }
}

function printMaze(maze: Maze) {
  console.info();
  for (const row of maze) {
    console.info(row);
  }
  console.info();
}

function organizeAmphipods(input: string[]): number {
  const state = {
    cache: {},
    minEnergy: Infinity,
    winMoves: [],
  };
  const maze = [...input];
  turn(state, maze, 0, []);
  return state.minEnergy;
}

function organizeUnfoldedAmphipods(input: string[]): number {
  const state = {
    cache: {},
    minEnergy: Infinity,
    winMoves: [],
  };
  const maze = [...input];
  const extra = ['  #D#C#B#A#', '  #D#B#A#C#'];
  maze.splice(3, 0, ...extra);
  turn(state, maze, 0, []);
  return state.minEnergy;
}

export { organizeAmphipods, organizeUnfoldedAmphipods };
