interface SnailfishNumber {
  parent: SnailfishNumber | null;
  left: SnailfishNumber | number;
  right: SnailfishNumber | number;
}

type SnailfishArray = [number | SnailfishArray, number | SnailfishArray];

const isNumber = (n: number | SnailfishNumber): n is number =>
  typeof n === 'number';
const isNode = (node: number | SnailfishNumber): node is SnailfishNumber =>
  !isNumber(node);
const isLeaf = (node: SnailfishNumber) =>
  isNumber(node.left) && isNumber(node.right);

function fromString(s: string) {
  const fromArray = (
    array: SnailfishArray,
    parent: SnailfishNumber | null = null
  ): SnailfishNumber => {
    const node: SnailfishNumber = {
      parent,
      left: 0,
      right: 0,
    };
    node.left = Array.isArray(array[0]) ? fromArray(array[0], node) : array[0];
    node.right = Array.isArray(array[1]) ? fromArray(array[1], node) : array[1];
    return node;
  };
  return fromArray(JSON.parse(s));
}

function toString(node: SnailfishNumber): string {
  const left = isNumber(node.left) ? node.left : toString(node.left);
  const right = isNumber(node.right) ? node.right : toString(node.right);
  return `[${left},${right}]`;
}

function findNearestRightParent(node: SnailfishNumber): SnailfishNumber | null {
  if (!node.parent) return null;
  if (node.parent.right === node) return node.parent;
  return findNearestRightParent(node.parent);
}

function findNearestLeftParent(node: SnailfishNumber): SnailfishNumber | null {
  if (!node.parent) return null;
  if (node.parent.left === node) return node.parent;
  return findNearestLeftParent(node.parent);
}

function findRightmostLeaf(
  node: SnailfishNumber | null
): SnailfishNumber | null {
  if (!node) return null;
  if (isNumber(node.right)) return node;
  return findRightmostLeaf(node.right);
}

function findLeftmostLeaf(
  node: SnailfishNumber | null
): SnailfishNumber | null {
  if (!node) return null;
  if (isNumber(node.left)) return node;
  return findLeftmostLeaf(node.left);
}

function explode(node: SnailfishNumber) {
  if (!isNumber(node.left) || !isNumber(node.right)) return;

  const nearestRightParent = findNearestRightParent(node);
  if (nearestRightParent) {
    if (isNumber(nearestRightParent.left)) {
      nearestRightParent.left += node.left;
    } else {
      const leftNeighborLeaf = findRightmostLeaf(nearestRightParent.left);
      if (leftNeighborLeaf && isNumber(leftNeighborLeaf.right)) {
        leftNeighborLeaf.right += node.left;
      }
    }
  }

  const nearestLeftParent = findNearestLeftParent(node);
  if (nearestLeftParent) {
    if (isNumber(nearestLeftParent.right)) {
      nearestLeftParent.right += node.right;
    } else {
      const rightNeighborLeaf = findLeftmostLeaf(nearestLeftParent.right);
      if (rightNeighborLeaf && isNumber(rightNeighborLeaf.left)) {
        rightNeighborLeaf.left += node.right;
      }
    }
  }

  if (node.parent) {
    if (node === node.parent.left) {
      node.parent.left = 0;
    } else {
      node.parent.right = 0;
    }
  }
}

function findNodeToExplode(tree: SnailfishNumber) {
  const find = (
    node: SnailfishNumber,
    depth: number
  ): SnailfishNumber | null => {
    if (depth >= 4 && isLeaf(node)) {
      return node;
    }
    if (isNode(node.left)) {
      const child = find(node.left, depth + 1);
      if (child) return child;
    }
    if (isNode(node.right)) {
      const child = find(node.right, depth + 1);
      if (child) return child;
    }
    return null;
  };
  return find(tree, 0);
}

function tryExplode(tree: SnailfishNumber) {
  const node = findNodeToExplode(tree);
  if (node) {
    explode(node);
    return true;
  }
  return false;
}

function trySplit(tree: SnailfishNumber) {
  const split = (parent: SnailfishNumber, value: number): SnailfishNumber => {
    const half = value / 2;
    return {
      parent,
      left: Math.floor(half),
      right: Math.ceil(half),
    };
  };

  const scan = (node: SnailfishNumber): boolean => {
    if (isNode(node.left)) {
      const done = scan(node.left);
      if (done) return done;
    } else {
      if (node.left > 9) {
        node.left = split(node, node.left);
        return true;
      }
    }
    if (isNode(node.right)) {
      const done = scan(node.right);
      if (done) return done;
    } else {
      if (node.right > 9) {
        node.right = split(node, node.right);
        return true;
      }
    }
    return false;
  };
  return scan(tree);
}

function reduce(tree: SnailfishNumber) {
  let changed = false;
  do {
    changed = tryExplode(tree);
    if (changed) continue;
    changed = trySplit(tree);
  } while (changed);
}

function add(left: SnailfishNumber, right: SnailfishNumber): SnailfishNumber {
  const result = {
    parent: null,
    left,
    right,
  };
  left.parent = result;
  right.parent = result;
  return result;
}

function addReduce(
  left: SnailfishNumber,
  right: SnailfishNumber
): SnailfishNumber {
  const result = add(left, right);
  reduce(result);
  return result;
}

function getNode(tree: SnailfishNumber, path: string) {
  let currentNode = tree;
  path.split('').forEach((direction) => {
    const child = direction === 'r' ? currentNode.right : currentNode.left;
    if (isNumber(child))
      throw new Error(`Path should only reference nodes, not leafs: "${path}"`);
    currentNode = child;
  });
  return currentNode;
}

function getMagnitude(node: SnailfishNumber): number {
  const left = isNumber(node.left) ? node.left : getMagnitude(node.left);
  const right = isNumber(node.right) ? node.right : getMagnitude(node.right);
  return 3 * left + 2 * right;
}

export { fromString, addReduce, getMagnitude };
