// Check answers locally; hardcoded answers and input paths
import { promises } from 'fs';
import { resolve } from 'path';

import { solutions } from './days';

type DailyAnswers = { [key: string]: number };
type Answers = { [key: string]: DailyAnswers };

const answers: Answers = {
  1: {
    1: 1462,
    2: 1497,
  },
  2: {
    1: 1727835,
    2: 1544000595,
  },
  3: {
    1: 2954600,
    2: 1662846,
  },
  4: {
    1: 31424,
    2: 23042,
  },
  5: {
    1: 6856,
    2: 20666,
  },
  6: {
    1: 352872,
    2: 1604361182149,
  },
  7: {
    1: 344605,
    2: 93699985,
  },
  8: {
    1: 344,
    2: 1048410,
  },
  9: {
    1: 591,
    2: 1113424,
  },
};

async function check() {
  let isOk = true;
  for (const day of Object.keys(answers)) {
    for (const part of Object.keys(answers[day])) {
      const input = await promises.readFile(
        resolve(__dirname, `../../input/day${day}`),
        { encoding: 'utf-8' }
      );
      const lines = input.split('\n').map((line) => line.trim());
      const result = solutions[day][part](lines);
      if (result === answers[day][part]) {
        console.info(`OK: day ${day}, part ${part}`);
      } else {
        isOk = false;
        console.info(
          `FAILED: day ${day}, part ${part}: expected: ${answers[day][part]}, got: ${result}.`
        );
      }
    }
  }
  console.info(`---------------\nSummary: ${isOk ? 'OK' : 'FAILED'}`);
}

check();
