function parse(input: string[]): number[] {
  return input[0].split(',').map(Number);
}

type FuelCostCalculator = (
  currentPosition: number,
  targetPosition: number
) => number;

function alignCrabs(getFuelCost: FuelCostCalculator, input: string[]): number {
  const positions = parse(input);
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);
  let minFuelCost = -1;
  for (
    let targetPosition = minPosition;
    targetPosition <= maxPosition;
    targetPosition++
  ) {
    const fuelCost = positions.reduce(
      (cost, position) => cost + getFuelCost(position, targetPosition),
      0
    );
    minFuelCost = minFuelCost < 0 ? fuelCost : Math.min(minFuelCost, fuelCost);
  }
  return minFuelCost ?? 0;
}

const alignThriftyCrabs = alignCrabs.bind(
  null,
  (currentPosition, targetPosition) =>
    Math.abs(targetPosition - currentPosition)
);

const alignWastefulCrabs = alignCrabs.bind(
  null,
  (currentPosition, targetPosition) => {
    const range = Math.abs(targetPosition - currentPosition);
    return (range * (range + 1)) / 2;
  }
);

export { alignThriftyCrabs, alignWastefulCrabs };
