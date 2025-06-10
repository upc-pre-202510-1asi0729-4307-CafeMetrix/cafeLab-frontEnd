export class ProductionCost {
  id?: number;
  lotId: number;
  directCosts: number;
  indirectCosts: number;
  totalCost: number;

  constructor(data: {
    lotId?: number;
    directCosts?: number;
    indirectCosts?: number;
    totalCost?: number;
  }) {
    this.lotId = data.lotId || 0;
    this.directCosts = data.directCosts || 0;
    this.indirectCosts = data.indirectCosts || 0;
    this.totalCost = data.totalCost || 0;
  }
}
