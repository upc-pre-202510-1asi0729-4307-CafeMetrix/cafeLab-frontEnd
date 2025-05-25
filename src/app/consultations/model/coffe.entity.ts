export class Coffee {
  /** Unique identifier for the coffee record */
  id: number;

  /** Commercial name of the coffee */
  name: string;

  /** Region where the coffee was produced */
  region: string;

  /** Botanical variety of the coffee */
  variety: string;

  /** Total weight of the coffee batch (in grams) */
  totalWeight: number;

  /**
   * Creates a new Coffee instance
   * @param coffee - Initial coffee properties
   */
  constructor(coffee: {
    id?: number,
    name?: string,
    region?: string,
    variety?: string,
    totalWeight?: number
  }) {
    this.id = coffee.id || 0;
    this.name = coffee.name || '';
    this.region = coffee.region || '';
    this.variety = coffee.variety || '';
    this.totalWeight = coffee.totalWeight || 0;
  }
}
