import { promises } from 'fs';

import { Command } from 'commander';

import { countHollows, countWindowHollows } from './days/01-sonar';
import { diveHarder, justDive } from './days/02-dive';
import {
  getLifeSupportRating,
  getPowerConsumption,
} from './days/03-binary-diagnostic';
import {
  getBingoFirstWinScore,
  getBingoLastWinScore,
} from './days/04-giant-squid';
import {
  getOverlapsCount,
  getOverlapsCountWithDiagonals,
} from './days/05-hydrothermal-venture';

const puzzleKeys = [
  'Day1Part1',
  'Day1Part2',
  'Day2Part1',
  'Day2Part2',
  'Day3Part1',
  'Day3Part2',
  'Day4Part1',
  'Day4Part2',
  'Day5Part1',
  'Day5Part2',
] as const;
type PuzzleKey = typeof puzzleKeys[number];

function isValidPuzzleKey(value: string): value is PuzzleKey {
  return puzzleKeys.includes(value as PuzzleKey);
}

type PuzzleSolution = (input: string[]) => number;

const solutions: { [key in PuzzleKey]: PuzzleSolution } = {
  Day1Part1: countHollows,
  Day1Part2: countWindowHollows,
  Day2Part1: justDive,
  Day2Part2: diveHarder,
  Day3Part1: getPowerConsumption,
  Day3Part2: getLifeSupportRating,
  Day4Part1: getBingoFirstWinScore,
  Day4Part2: getBingoLastWinScore,
  Day5Part1: getOverlapsCount,
  Day5Part2: getOverlapsCountWithDiagonals,
};

const program = new Command();
program
  .requiredOption('-i, --input <file path>', 'Input file path')
  .requiredOption('-p, --puzzle <puzzle>', 'Puzzle ID, format: DayXPartY')
  .parse();
const args = program.opts();

async function run() {
  if (!isValidPuzzleKey(args.puzzle))
    return Promise.reject(new Error('Puzzle ID is incorrect'));
  const input = await promises.readFile(args.input, { encoding: 'utf-8' });
  const lines = input.split('\n').map((line) => line.trim());
  const result = solutions[args.puzzle](lines);
  console.info(`Answer: ${result}`);
  return true;
}

run();
