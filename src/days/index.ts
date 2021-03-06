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
import { breedTheFish } from './06-lanternfish';
import {
  alignThriftyCrabs,
  alignWastefulCrabs,
} from './07-the-treachery-of-whales';
import {
  countSpecialDigits,
  decodeGlitchedDigits,
} from './08-seven-segment-search';
import { getLargestBasinsSize, getLowPointsRiskLevel } from './09-smoke-basin';
import {
  calculateCompletionScore,
  calculateSyntaxScore,
} from './10-syntax-scoring';
import { countFlashes, ohSoBright } from './11-dumbo-octopus';
import {
  canVisitAnySmallCaveOnce,
  canVisitOneSmallCaveTwice,
  countPaths,
} from './12-passage-pathing';
import { foldAllTheWay, foldOnce } from './13-transparent-origami';
import { countPolymerElements } from './14-extended-polymerization';
import { calculateLowestRiskXL, calculateLowestRiskXS } from './15-chiton';
import { getVersionNumberSum, solveExpression } from './16-packet-decoder';
import { countCorrectVelocities, findHighestProbeY } from './17-trick-shot';
import {
  calculateFinalSumMagnitude,
  calculateLargestSumMagnitude,
} from './18-snailfish';
import { countBeacons, getMaxManhattanDistance } from './19-beacon-scanner';
import { countLitPixels } from './20-trench-map';
import { getBoringDiceScore, getDiracDiceScore } from './21-dirac-dice';
import { rebootTheReactor, rebootTheReactorRedux } from './22-reactor-reboot';
import { organizeAmphipods, organizeUnfoldedAmphipods } from './23-amphipod';
import {
  findLargestMonad,
  findSmallestMonad,
} from './24-arithmetic-logic-unit';
import { landTheSubmarine } from './25-sea-cucumber';

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
  6: {
    1: breedTheFish.bind(null, 80),
    2: breedTheFish.bind(null, 256),
  },
  7: {
    1: alignThriftyCrabs,
    2: alignWastefulCrabs,
  },
  8: {
    1: countSpecialDigits,
    2: decodeGlitchedDigits,
  },
  9: {
    1: getLowPointsRiskLevel,
    2: getLargestBasinsSize.bind(null, 3),
  },
  10: {
    1: calculateSyntaxScore,
    2: calculateCompletionScore,
  },
  11: {
    1: countFlashes.bind(null, 100),
    2: ohSoBright,
  },
  12: {
    1: countPaths.bind(null, canVisitAnySmallCaveOnce),
    2: countPaths.bind(null, canVisitOneSmallCaveTwice),
  },
  13: {
    1: foldOnce,
    2: foldAllTheWay,
  },
  14: {
    1: countPolymerElements.bind(null, 10),
    2: countPolymerElements.bind(null, 40),
  },
  15: {
    1: calculateLowestRiskXS,
    2: calculateLowestRiskXL,
  },
  16: {
    1: getVersionNumberSum,
    2: solveExpression,
  },
  17: {
    1: findHighestProbeY,
    2: countCorrectVelocities,
  },
  18: {
    1: calculateFinalSumMagnitude,
    2: calculateLargestSumMagnitude,
  },
  19: {
    1: countBeacons,
    2: getMaxManhattanDistance,
  },
  20: {
    1: countLitPixels.bind(0, 2),
    2: countLitPixels.bind(0, 50),
  },
  21: {
    1: getBoringDiceScore,
    2: getDiracDiceScore,
  },
  22: {
    1: rebootTheReactorRedux,
    2: rebootTheReactor,
  },
  23: {
    1: organizeAmphipods,
    2: organizeUnfoldedAmphipods,
  },
  24: {
    1: findLargestMonad,
    2: findSmallestMonad,
  },
  25: {
    1: landTheSubmarine,
  },
};

export { solutions };
