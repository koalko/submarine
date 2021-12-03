interface TreeNode {
  key: string;
  weight: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeRootNode {
  weight: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

type ChildNodeSelector = (node: TreeNode | TreeRootNode) => TreeNode | null;

function makeTreeNode(key: string, weight = 0): TreeNode {
  return {
    key,
    weight,
    left: null,
    right: null,
  };
}

function makeTreeRootNode(): TreeRootNode {
  return {
    weight: 0,
    left: null,
    right: null,
  };
}

function appendToTreeNode(node: TreeNode | TreeRootNode, key: string) {
  switch (key) {
    case '0':
      if (!node.left) node.left = makeTreeNode(key);
      node.left.weight += 1;
      return node.left;
    case '1':
      if (!node.right) node.right = makeTreeNode(key);
      node.right.weight += 1;
      return node.right;
    default:
      throw new Error(`Incorrect character in the input`);
  }
}

class Tree {
  #tree = makeTreeRootNode();

  dump() {
    console.info(JSON.stringify(this.#tree, null, '\t'));
  }

  add(path: string[]) {
    let node = this.#tree;
    node.weight += 1;
    path.forEach((key) => {
      node = appendToTreeNode(node, key);
    });
  }

  findPath(selector: ChildNodeSelector) {
    const path: string[] = [];
    let node = this.#tree;
    while (node) {
      const nextNode = selector(node);
      if (!nextNode) break;
      path.push(nextNode.key);
      node = nextNode;
    }
    return path;
  }

  getMostCommonPath() {
    return this.findPath((node: TreeNode | TreeRootNode) => {
      if (!node.left && !node.right) return null;
      if (node.left && !node.right) return node.left;
      if (!node.left && node.right) return node.right;
      const leftWeight = node.left?.weight ?? 0;
      const rightWeight = node.right?.weight ?? 0;
      return rightWeight >= leftWeight ? node.right : node.left;
    });
  }

  getLeastCommonPath() {
    return this.findPath((node: TreeNode | TreeRootNode) => {
      if (!node.left && !node.right) return null;
      if (node.left && !node.right) return node.left;
      if (!node.left && node.right) return node.right;
      const leftWeight = node.left?.weight ?? 0;
      const rightWeight = node.right?.weight ?? 0;
      return rightWeight >= leftWeight ? node.left : node.right;
    });
  }
}

export { Tree };
