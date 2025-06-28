export class InventoryEntry {
  id: number;
  coffeeLotId: number;
  quantityUsed: number;
  dateUsed: string;
  finalProduct?: string;

  constructor(data: {
    id?: number;
    coffeeLotId?: number;
    quantityUsed?: number;
    dateUsed?: string;
    finalProduct?: string;
  }) {
    this.id = data.id || 0;
    this.coffeeLotId = data.coffeeLotId || 0;
    this.quantityUsed = data.quantityUsed || 0;
    this.dateUsed = data.dateUsed || '';
    this.finalProduct = data.finalProduct || '';
  }
}
