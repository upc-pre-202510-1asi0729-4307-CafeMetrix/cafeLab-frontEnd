export class Coffee {
  /** Unique identifier for the coffee record */
  id: string;

  /** Commercial name of the coffee */
  name: string;

  /** Region where the coffee was produced */
  region: string;

  /** Botanical variety of the coffee */
  variety: string;

  /** Total weight of the coffee batch (in grams) */
  totalWeight: number;

  /** User ID (owner of this coffee record) */
  userId: string;

  constructor(coffee: {
    id?: string,
    name?: string,
    region?: string,
    variety?: string,
    totalWeight?: number,
    userId?: string
  }) {
    this.id = coffee.id ? String(coffee.id) : '';
    this.name = coffee.name || '';
    this.region = coffee.region || '';
    this.variety = coffee.variety || '';
    this.totalWeight = coffee.totalWeight || 0;
    this.userId = coffee.userId ? String(coffee.userId) : '';
  }
}
