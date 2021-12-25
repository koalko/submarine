type Cucumbers = string[][];

type FloorMap = {
  width: number;
  height: number;
  cucumbers: Cucumbers;
  mobile: boolean;
};

function parse(input: string[]): FloorMap {
  const height = input.length;
  const width = input[0].length;
  const cucumbers: Cucumbers = input.map((line) => line.split(''));
  return {
    width,
    height,
    cucumbers,
    mobile: true,
  };
}

function print(map: FloorMap) {
  console.log('');
  map.cucumbers.forEach((row) => console.log(row.join('')));
  console.log('');
}

function step(map: FloorMap): FloorMap {
  let mobile = false;
  const cucumbersEast: Cucumbers = map.cucumbers.map((row) =>
    row.join('').split('')
  );
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (map.cucumbers[y][x] === '>') {
        const xs = x === map.width - 1 ? 0 : x + 1;
        const xn = map.cucumbers[y][xs] === '.' ? xs : x;
        if (xn !== x) {
          cucumbersEast[y][x] = '.';
          cucumbersEast[y][xn] = '>';
          mobile = true;
        }
      }
    }
  }
  const cucumbersSouth: Cucumbers = cucumbersEast.map((row) =>
    row.join('').split('')
  );
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (cucumbersEast[y][x] === 'v') {
        const ys = y === map.height - 1 ? 0 : y + 1;
        const yn = cucumbersEast[ys][x] === '.' ? ys : y;
        if (yn !== y) {
          cucumbersSouth[y][x] = '.';
          cucumbersSouth[yn][x] = 'v';
          mobile = true;
        }
      }
    }
  }
  return {
    width: map.width,
    height: map.height,
    cucumbers: cucumbersSouth,
    mobile,
  };
}

function landTheSubmarine(input: string[]): number {
  let map = parse(input);
  let stepNo = 0;
  while (map.mobile) {
    stepNo += 1;
    map = step(map);
  }
  return stepNo;
}

export { landTheSubmarine };
