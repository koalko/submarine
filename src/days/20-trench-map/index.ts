type Enhancer = (1 | 0)[];
type Image = (1 | 0)[][];

const WindowSize = 3;
const WindowShift = Math.floor(WindowSize / 2);
const WindowSizeSquared = WindowSize * WindowSize;

const char2bin = (c: string) => (c === '#' ? 1 : 0);
const bin2char = (n: 1 | 0) => (n === 1 ? '#' : '.');

const pixel = (image: Image, row: number, col: number, bg: number) =>
  image?.[row]?.[col] ?? bg;

function fold(image: Image, row: number, col: number, bg: number): number {
  let value = 0;
  for (let rowShift = -WindowShift; rowShift <= WindowShift; rowShift += 1) {
    for (let colShift = -WindowShift; colShift <= WindowShift; colShift += 1) {
      const bitShift =
        WindowSizeSquared -
        1 -
        ((rowShift + WindowShift) * WindowSize + colShift + WindowShift);
      value |= pixel(image, row + rowShift, col + colShift, bg) << bitShift;
    }
  }
  return value;
}

function enhance(image: Image, enhancer: Enhancer, bg: number) {
  const rows = image.length;
  const cols = image[0].length; // Bold assumption
  const extra = WindowShift;
  const extra2 = extra * 2;
  const result = new Array(rows + extra2).fill(0);
  for (let row = 0; row < rows + extra2; row += 1) {
    result[row] = new Array(cols + extra2).fill(0);
    for (let col = 0; col < cols + extra2; col += 1) {
      const index = fold(image, row - extra, col - extra, bg);
      result[row][col] = enhancer[index];
    }
  }
  return result;
}

function draw(image: Image) {
  const rows = image.length;
  console.info('-'.repeat(image[0].length));
  for (let row = 0; row < rows; row += 1) {
    console.info(image[row].map(bin2char).join(''));
  }
}

function countPixels(image: Image, value: 1 | 0) {
  return image.reduce(
    (count: number, row) =>
      count +
      row.reduce(
        (count: number, pixel) => count + (pixel === value ? 1 : 0),
        0
      ),
    0
  );
}

function parse(input: string[]): { enhancer: Enhancer; image: Image } {
  const enhancer = input[0].split('').map(char2bin);
  // TODO: Check row sizes
  const image = input.slice(2).map((line) => line.split('').map(char2bin));
  return { enhancer, image };
}

function countLitPixels(maxLevel: number, input: string[]): number {
  const { enhancer, image } = parse(input);
  let enhanced = image;
  for (let level = 0; level < maxLevel; level += 1) {
    // This (bg "calculation") is a hack, but in other cases this task is unsolvable anyway :)
    const bg = enhancer[0] === 1 ? level % 2 : 0;
    enhanced = enhance(enhanced, enhancer, bg);
  }
  return countPixels(enhanced, 1);
}

export { countLitPixels };
