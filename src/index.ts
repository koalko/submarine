import { promises } from 'fs';

import { Command } from 'commander';

import { solutions } from './days';

const program = new Command();
program
  .requiredOption('-i, --input <file path>', 'Input file path')
  .requiredOption(
    '-d, --day <day number>',
    'Challenge day (https://adventofcode.com/2021)'
  )
  .requiredOption('-p, --part <part number>', 'Challenge part (usually 1 or 2)')
  .parse();
const args = program.opts();

async function run() {
  const solution = solutions[args.day]?.[args.part];
  if (!solution)
    return Promise.reject(
      new Error(
        `There is no solution for the day ${args.day} (part ${args.part}) puzzle at the moment`
      )
    );
  const input = await promises.readFile(args.input, { encoding: 'utf-8' });
  const lines = input.split('\n').map((line) => line.trim());
  const result = solution(lines);
  console.info(`Answer: ${result}`);
  return true;
}

run();
