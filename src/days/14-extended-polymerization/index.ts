type Rules = Map<string, string>;
type StringCounts = Record<string, number>;

interface Task {
  rules: Rules;
  sequence: string;
}

function parse(input: string[]): Task {
  const RULE_BREAKER = ' -> ';
  const rules = new Map<string, string>();
  let sequence = null;
  for (const line of input) {
    if (line === '') continue;
    if (line.includes(RULE_BREAKER)) {
      const [pair, insertion] = line.split(RULE_BREAKER);
      rules.set(pair, insertion);
    } else {
      sequence = line;
    }
  }
  if (!sequence) throw new Error('Unable to locate a starting sequence');
  return { rules, sequence };
}

const incrementStringCount = (
  counts: StringCounts,
  key: string,
  amount = 1
) => {
  counts[key] = (counts[key] ?? 0) + amount;
};

function expandPairs(pairs: StringCounts, rules: Rules) {
  const expanded: StringCounts = {};
  for (const pair of Object.keys(pairs)) {
    const insertion = rules.get(pair);
    incrementStringCount(expanded, `${pair[0]}${insertion}`, pairs[pair]);
    incrementStringCount(expanded, `${insertion}${pair[1]}`, pairs[pair]);
  }
  return expanded;
}

function getPairCounts({ rules, sequence }: Task, steps: number) {
  let pairCounts: StringCounts = {};

  for (let charNo = 0; charNo < sequence.length - 1; charNo += 1) {
    const [first, second] = [sequence[charNo], sequence[charNo + 1]];
    incrementStringCount(pairCounts, `${first}${second}`);
  }

  for (let stepNo = 0; stepNo < steps; stepNo += 1) {
    pairCounts = expandPairs(pairCounts, rules);
  }

  return pairCounts;
}

function getCharCounts(pairCounts: StringCounts) {
  const charCounts: StringCounts = {};
  for (const pair of Object.keys(pairCounts)) {
    incrementStringCount(charCounts, pair[0], pairCounts[pair]);
    incrementStringCount(charCounts, pair[1], pairCounts[pair]);
  }
  for (const char of Object.keys(charCounts)) {
    charCounts[char] = Math.ceil(charCounts[char] / 2);
  }
  return charCounts;
}

function countPolymerElements(steps: number, input: string[]): number {
  const task = parse(input);
  const counts = Object.values(getCharCounts(getPairCounts(task, steps)));
  return Math.max(...counts) - Math.min(...counts);
}

export { countPolymerElements };
