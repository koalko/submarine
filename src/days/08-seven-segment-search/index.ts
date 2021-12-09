const getAllGlitchedDigits = (line: string) =>
  line.replace(' |', '').split(' ');

const getOutputGlitchedDigits = (line: string) =>
  line.split('|')[1].trim().split(' ');

const chars = 'abcdefg'
  .split('')
  .reduce<{ [key: string]: number }>((result, char, index) => {
    result[char] = index;
    return result;
  }, {});

function encode(digit: string) {
  return digit.split('').reduce((result, char) => {
    if (chars[char] === undefined)
      throw new Error(
        `Unsupported character "${char}" in the digit "${digit}"`
      );
    return result | (1 << chars[char]);
  }, 0);
}

function deduce(line: string) {
  const glitchedDigits: Map<number, Set<number>> = new Map();
  getAllGlitchedDigits(line).forEach((digit) => {
    const digits = glitchedDigits.get(digit.length) ?? new Set();
    digits.add(encode(digit));
    glitchedDigits.set(digit.length, digits);
  });

  const [cf] = glitchedDigits.get(2) ?? [];
  const [bcdf] = glitchedDigits.get(4) ?? [];
  const [acf] = glitchedDigits.get(3) ?? [];
  const [abcdefg] = glitchedDigits.get(7) ?? [encode('abcdefg')];
  if (!cf || !bcdf || !acf)
    throw new Error(`Unable to deduce the result from the input ${line}`);
  const a = acf & ~cf;
  const bd = bcdf & ~cf;
  const eg = abcdefg & ~(bcdf | acf);
  const abfg = [...(glitchedDigits.get(6) ?? [])].reduce(
    (result, digit) => result & digit,
    abcdefg
  );
  if (abfg === abcdefg)
    throw new Error(`Unable to deduce the result from the input ${line}`);
  const c = cf & ~abfg;
  const d = bd & ~abfg;
  const e = eg & ~abfg;
  const f = cf & ~c;
  const b = bd & ~d;
  const abcdef = [a, b, c, d, e, f].reduce(
    (result, digit) => result | digit,
    0
  );
  if (!abcdef)
    throw new Error(`Unable to deduce the result from the input ${line}`);
  const g = abcdefg & ~abcdef;

  return new Map([
    [a | b | c | e | f | g, '0'],
    [c | f, '1'],
    [a | c | d | e | g, '2'],
    [a | c | d | f | g, '3'],
    [b | c | d | f, '4'],
    [a | b | d | f | g, '5'],
    [a | b | d | e | f | g, '6'],
    [a | c | f, '7'],
    [a | b | c | d | e | f | g, '8'],
    [a | b | c | d | f | g, '9'],
  ]);
}

function decode(line: string) {
  const glitchedDigitsMap = deduce(line);
  const outputGlitchedDigits = getOutputGlitchedDigits(line);
  const result = outputGlitchedDigits
    .map(encode)
    .map((n) => glitchedDigitsMap.get(n))
    .join('');
  return Number(result);
}

function decodeGlitchedDigits(input: string[]): number {
  return input.map(decode).reduce((result, n) => result + n, 0);
}

function countSpecialDigits(input: string[]): number {
  const output = input.map(getOutputGlitchedDigits).flat();
  return output.filter((code) => [2, 3, 4, 7].includes(code.length)).length;
}

export { countSpecialDigits, decodeGlitchedDigits };
