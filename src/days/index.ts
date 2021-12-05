import { countHollows, countWindowHollows } from './01-sonar';
import { diveHarder, justDive } from './02-dive';
import {
  getLifeSupportRating,
  getPowerConsumption,
} from './03-binary-diagnostic';
import { getBingoFirstWinScore, getBingoLastWinScore } from './04-giant-squid';
import {
  getOverlapsCount,
  getOverlapsCountWithDiagonals,
} from './05-hydrothermal-venture';

type PuzzleSolution = (input: string[]) => number;
type DailySolutions = { [key: string]: PuzzleSolution };
type Solutions = { [key: string]: DailySolutions };

const solutions: Solutions = {
  1: {
    1: countHollows,
    2: countWindowHollows,
  },
  2: {
    1: justDive,
    2: diveHarder,
  },
  3: {
    1: getPowerConsumption,
    2: getLifeSupportRating,
  },
  4: {
    1: getBingoFirstWinScore,
    2: getBingoLastWinScore,
  },
  5: {
    1: getOverlapsCount,
    2: getOverlapsCountWithDiagonals,
  },
};

export { solutions };
