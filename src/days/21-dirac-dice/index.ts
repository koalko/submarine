function parse(input: string[]): [number, number] {
  return [
    Number(input[0].split('').pop()) - 1,
    Number(input[1].split('').pop()) - 1,
  ];
}

function getBoringDiceScore(input: string[]): number {
  const position = parse(input);

  const score = [0, 0];
  let dice = 0;
  let player = -1;
  do {
    player = player === 0 ? 1 : 0;
    for (let roll = 0; roll < 3; roll += 1) {
      dice += 1;
      position[player] = (position[player] + dice) % 10;
    }
    score[player] += position[player] + 1;
  } while (score[player] < 1000);

  return Math.min(...score) * dice;
}

function getDiracDiceScore(input: string[]): number {
  const position = parse(input);

  const cache: Map<string, number[]> = new Map();
  const cacheKey = (position: number[], score: number[], player: number) =>
    `${position.join('.')}:${score.join('.')}:${player}`;

  const countWins = (
    position: number[],
    score: number[],
    player: number
  ): number[] => {
    const cached = cache.get(cacheKey(position, score, player));
    if (cached !== undefined) return cached;
    const winCounts = [0, 0];
    const newPosition = [...position];
    const newScore = [...score];
    // TODO: -_-
    for (let roll1 = 1; roll1 <= 3; roll1 += 1) {
      for (let roll2 = 1; roll2 <= 3; roll2 += 1) {
        for (let roll3 = 1; roll3 <= 3; roll3 += 1) {
          newPosition[player] = (position[player] + roll1 + roll2 + roll3) % 10;
          newScore[player] = score[player] + newPosition[player] + 1;
          if (newScore[player] >= 21) {
            winCounts[player] += 1;
          } else {
            countWins(newPosition, newScore, Math.abs(player - 1)).forEach(
              (winCount, player) => {
                winCounts[player] += winCount;
              }
            );
          }
        }
      }
    }
    cache.set(cacheKey(position, score, player), winCounts);
    return winCounts;
  };

  const winCounts = countWins(position, [0, 0], 0);
  return Math.max(...winCounts);
}

export { getBoringDiceScore, getDiracDiceScore };
