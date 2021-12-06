const DAYS_TO_BREED = 6;
const DAYS_TO_MATURE = 2;

class Shoal {
  #shoal: Map<number, number> = new Map();

  /**
   * Add an amount of fish with internal timer
   * @param day - fish' internal timer
   * @param amount - amount of fish to add
   */
  add(day: number, amount: number) {
    this.#shoal.set(day, (this.#shoal.get(day) ?? 0) + amount);
  }

  /**
   * Get the total amount of fish
   */
  size() {
    return Array.from(this.#shoal.values()).reduce(
      (result, n) => result + n,
      0
    );
  }

  entries() {
    return this.#shoal.entries();
  }

  /**
   * Produce a new shoal from today's shoal
   * @param shoal today's shoal
   * @returns tomorrow's shoal
   */
  static fromTomorrow(shoal: Shoal) {
    const nextShoal = new Shoal();
    for (const [day, amount] of shoal.entries()) {
      if (day > 0) {
        nextShoal.add(day - 1, amount);
      } else {
        nextShoal.add(DAYS_TO_BREED, amount);
        nextShoal.add(DAYS_TO_BREED + DAYS_TO_MATURE, amount);
      }
    }
    return nextShoal;
  }
}

function parse(input: string[]): number[] {
  return input[0].split(',').map(Number);
}

/**
 * Breed the fish over the period
 * @param period - total breeding period in days
 * @param input - input (only the first line matters)
 */
function breedTheFish(period: number, input: string[]): number {
  let shoal = new Shoal();
  const days = parse(input);
  for (const day of days) {
    shoal.add(day, 1);
  }
  for (let day = 0; day < period; day += 1) {
    shoal = Shoal.fromTomorrow(shoal);
  }
  return shoal.size();
}

export { breedTheFish };
