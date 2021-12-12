type CaveName = string;
type CavePath = CaveName[];
type CaveVisitValidator = (cave: CaveName, path: CavePath) => boolean;

class CaveNetwork {
  private network: Map<CaveName, Set<CaveName>> = new Map();

  private getLinks(cave: CaveName): Set<CaveName> {
    let links = this.network.get(cave);
    if (links) return links;
    links = new Set<CaveName>();
    this.network.set(cave, links);
    return links;
  }

  links(cave: CaveName) {
    const links = this.network.get(cave);
    if (!links) throw new Error(`Incorrect cave name ${cave}`);
    return links[Symbol.iterator]();
  }

  connect(cave1: CaveName, cave2: CaveName) {
    this.getLinks(cave1).add(cave2);
    this.getLinks(cave2).add(cave1);
  }

  dump() {
    console.info('');
    console.info(this.network);
  }

  static get firstCave() {
    return 'start';
  }

  static get lastCave() {
    return 'end';
  }

  static isSmallCave(cave: CaveName) {
    return cave === cave.toLowerCase();
  }
}

const canVisitAnySmallCaveOnce = (cave: CaveName, path: CavePath) => {
  if (!CaveNetwork.isSmallCave(cave)) return true;
  return !path.includes(cave);
};

// TODO: Check performance, it might be worth it to use some kind of "visited" map
const canVisitOneSmallCaveTwice = (cave: CaveName, path: CavePath) => {
  if (!CaveNetwork.isSmallCave(cave)) return true;
  const visits = new Map<string, number>([[cave, 1]]);
  for (const caveInPath of path) {
    if (!CaveNetwork.isSmallCave(caveInPath)) continue;
    visits.set(caveInPath, (visits.get(caveInPath) ?? 0) + 1);
  }
  if ((visits.get(CaveNetwork.firstCave) ?? 0) > 1) return false;
  if ((visits.get(CaveNetwork.lastCave) ?? 0) > 1) return false;
  const totalCountOver1 = [...visits.values()]
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + count, 0);
  if (totalCountOver1 > 2) return false;
  return true;
};

function explore(caveNetwork: CaveNetwork, canVisitCave: CaveVisitValidator) {
  const paths: string[][] = [];
  const visit = (cave: CaveName, path: CavePath) => {
    if (!canVisitCave(cave, path)) return;
    if (cave === CaveNetwork.lastCave) {
      paths.push([...path, cave]);
      return;
    }
    for (const caveTo of caveNetwork.links(cave)) {
      visit(caveTo, [...path, cave]);
    }
  };
  visit(CaveNetwork.firstCave, []);
  return paths;
}

function parse(input: string[]): CaveNetwork {
  const caveNetwork = new CaveNetwork();
  for (const line of input) {
    const [cave1, cave2] = line.split('-');
    caveNetwork.connect(cave1, cave2);
  }
  return caveNetwork;
}

function countPaths(canVisitCave: CaveVisitValidator, input: string[]): number {
  const caveNetwork = parse(input);
  const paths = explore(caveNetwork, canVisitCave);
  return paths.length;
}

export { countPaths, canVisitAnySmallCaveOnce, canVisitOneSmallCaveTwice };
