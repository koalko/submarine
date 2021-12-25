const registers = ['w', 'x', 'y', 'z'] as const;
type Register = typeof registers[number];

function isValidRegister(value: string): value is Register {
  return registers.includes(value as Register);
}

const opTypes = ['inp', 'add', 'mul', 'div', 'mod', 'eql'] as const;
type OpType = typeof opTypes[number];

function isValidOpType(value: string): value is OpType {
  return opTypes.includes(value as OpType);
}

type Op1 = (l: Register) => void;
type Op2 = (l: Register, r: string) => void;

type Op = Op1 | Op2;

function makeAlu(input: string) {
  const reg = (arg: Register) => registers.get(arg) ?? 0;
  const val = (arg: string) => (isValidRegister(arg) ? reg(arg) : Number(arg));

  let inputPos = 0;
  const registers: Map<Register, number> = new Map([
    ['w', 0],
    ['x', 0],
    ['y', 0],
    ['z', 0],
  ]);
  const operations: Map<OpType, Op> = new Map([
    [
      'inp',
      (a: Register) => {
        registers.set(a, Number(input[inputPos]));
        inputPos += 1;
      },
    ],
    [
      'add',
      (a: Register, b: string) => {
        registers.set(a, reg(a) + val(b));
      },
    ],
    [
      'mul',
      (a: Register, b: string) => {
        registers.set(a, reg(a) * val(b));
      },
    ],
    [
      'div',
      (a: Register, b: string) => {
        registers.set(a, Math.trunc(reg(a) / val(b)));
      },
    ],
    [
      'mod',
      (a: Register, b: string) => {
        registers.set(a, reg(a) % val(b));
      },
    ],
    [
      'eql',
      (a: Register, b: string) => {
        registers.set(a, reg(a) === val(b) ? 1 : 0);
      },
    ],
  ]);

  const run = (instruction: string) => {
    const [opType, a, b] = instruction.split(' ');
    if (!isValidOpType(opType)) {
      throw new Error(
        `Unknown operation: "${opType}" in the instruction "${instruction}"`
      );
    }
    if (!isValidRegister(a)) {
      throw new Error(
        `Unknown register: "${a}" in the instruction "${instruction}"`
      );
    }
    const op = operations.get(opType);
    if (!op) {
      throw new Error(`Unable to execute the instruction "${instruction}"`);
    }
    op(a, b);
  };

  const isMonadValid = () => reg('z') === 0;

  const getState = () => ({
    w: reg('w'),
    x: reg('x'),
    y: reg('y'),
    z: reg('z'),
  });

  const setState = ({
    w,
    x,
    y,
    z,
  }: {
    w: number;
    x: number;
    y: number;
    z: number;
  }) => {
    registers.set('w', w);
    registers.set('x', x);
    registers.set('y', y);
    registers.set('z', z);
  };

  return {
    run,
    isMonadValid,
    getState,
    setState,
  };
}

type ALU = ReturnType<typeof makeAlu>;

function findLargestMonad(input: string[]): number {
  const n = 65984919997939;
  const alu = makeAlu(`${n}`);
  input.forEach(alu.run);
  return alu.isMonadValid() ? n : -1;
}

function findSmallestMonad(input: string[]): number {
  const n = 11211619541713;
  const alu = makeAlu(`${n}`);
  input.forEach(alu.run);
  return alu.isMonadValid() ? n : -1;
}

export { findLargestMonad, findSmallestMonad };
