export class ProductionCostEntity {
  constructor(private cost: any) {}

  get totalDirectCost(): number {
    return (this.cost.rawMaterialsCost || 0) + (this.cost.laborCost || 0);
  }

  get totalIndirectCost(): number {
    return (this.cost.transportCost || 0) +
      (this.cost.storageCost || 0) +
      (this.cost.processingCost || 0) +
      (this.cost.otherIndirectCosts || 0);
  }

  get totalCost(): number {
    return this.totalDirectCost + this.totalIndirectCost;
  }

  get costPerKg(): number {
    return this.cost.totalKg ? this.totalCost / this.cost.totalKg : 0;
  }

  get suggestedPrice(): number {
    return this.totalCost * (1 + (this.cost.margin || 0) / 100);
  }

  get potentialMargin(): number {
    return this.suggestedPrice - this.costPerKg;
  }
}
