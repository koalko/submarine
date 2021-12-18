interface Node {
  type: number;
  version: number;
}

interface LiteralNodePayload {
  value: number;
}

interface OperatorNodePayload {
  children: Array<LiteralNode | OperatorNode>;
  isLengthInBits: boolean;
  length: number;
  leftoverLength: number;
}

interface LiteralNode extends Node, LiteralNodePayload {}

interface OperatorNode extends Node, OperatorNodePayload {}

const PacketType = {
  Sum: 0,
  Product: 1,
  Minimum: 2,
  Maximum: 3,
  Literal: 4,
  GreaterThan: 5,
  LessThan: 6,
  EqualTo: 7,
};

function isLiteralNode(node: Node): node is LiteralNode {
  return 'value' in node;
}

function isOperatorNode(node: Node): node is OperatorNode {
  return 'isLengthInBits' in node;
}

function decodeLiteralBinPacket(packetBin: string, position: number) {
  let pos = position + 6;
  let numberBin = '';
  let isLastNumber = false;
  do {
    isLastNumber = packetBin[pos] === '0';
    numberBin += packetBin.substr(pos + 1, 4);
    pos += 5;
  } while (!isLastNumber);
  return {
    newPosition: pos,
    value: parseInt(numberBin, 2),
  };
}

function decodeOperatorBinPacket(packetBin: string, position: number) {
  const isLengthInBits = packetBin[position + 6] === '0';
  const lengthFlagSize = isLengthInBits ? 15 : 11;
  const leftoverLength = parseInt(
    packetBin.substr(position + 7, lengthFlagSize),
    2
  );
  return {
    newPosition: position + 7 + lengthFlagSize,
    isLengthInBits,
    leftoverLength,
  };
}

// TODO: Refactoring
function decodeBinPacket(
  packetBin: string,
  parentNode: OperatorNode,
  position: number
): number {
  let newPosition = position;
  do {
    const version = parseInt(packetBin.substr(newPosition, 3), 2);
    const type = parseInt(packetBin.substr(newPosition + 3, 3), 2);
    if (type === PacketType.Literal) {
      const decoded = decodeLiteralBinPacket(packetBin, newPosition);
      parentNode.children.push({
        type,
        version,
        value: decoded.value,
      });
      newPosition = decoded.newPosition;
    } else {
      const decoded = decodeOperatorBinPacket(packetBin, newPosition);
      const node = {
        type,
        version,
        children: [],
        isLengthInBits: decoded.isLengthInBits,
        length: decoded.leftoverLength,
        leftoverLength: decoded.leftoverLength,
      };
      parentNode.children.push(node);
      newPosition = decodeBinPacket(packetBin, node, decoded.newPosition);
    }
    parentNode.leftoverLength = parentNode.isLengthInBits
      ? parentNode.length - (newPosition - position)
      : parentNode.leftoverLength - 1;
  } while (parentNode.leftoverLength > 0);
  return newPosition;
}

function hex2bin(packetHex: string) {
  return packetHex
    .split('')
    .map((hex) => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
}

function parse(input: string[]) {
  const packetBin = hex2bin(input[0]);
  const tree: OperatorNode = {
    type: -1,
    version: 0,
    isLengthInBits: false,
    length: 1,
    leftoverLength: 1,
    children: [],
  };
  decodeBinPacket(packetBin, tree, 0);
  return tree;
}

function getVersionNumberSum(input: string[]): number {
  function traverse(node: OperatorNode) {
    let sum = 0;
    for (const child of node.children) {
      sum += child.version;
      if (!isLiteralNode(child)) sum += traverse(child);
    }
    return sum;
  }
  const tree = parse(input);
  return traverse(tree);
}

const ops = {
  [PacketType.Sum]: (args: number[]) => args.reduce((sum, arg) => sum + arg, 0),
  [PacketType.Product]: (args: number[]) =>
    args.reduce((product, arg) => product * arg, 1),
  [PacketType.Minimum]: (args: number[]) => Math.min(...args),
  [PacketType.Maximum]: (args: number[]) => Math.max(...args),
  [PacketType.GreaterThan]: ([first, second]: number[]) =>
    first > second ? 1 : 0,
  [PacketType.LessThan]: ([first, second]: number[]) =>
    first < second ? 1 : 0,
  [PacketType.EqualTo]: ([first, second]: number[]) =>
    first === second ? 1 : 0,
};

function solveExpression(input: string[]): number {
  function solve(node: OperatorNode | LiteralNode): number {
    if (isLiteralNode(node)) {
      return node.value;
    } else {
      const op = ops[node.type];
      // TODO: Check while parsing
      if (!op) throw new Error(`Unsupported operation type ${node.type}`);
      return op(node.children.map(solve));
    }
  }
  const tree = parse(input);
  return solve(tree.children[0]);
}

export { getVersionNumberSum, solveExpression };
