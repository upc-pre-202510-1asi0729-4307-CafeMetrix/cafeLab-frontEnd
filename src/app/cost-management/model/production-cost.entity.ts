export interface ProductionCost {
  id?: string;
  selectedLot: string;
  rawMaterialsCost: number;
  laborCost: number;
  transportCost: number;
  storageCost: number;
  processingCost: number;
  otherIndirectCosts: number;
  totalCost: number;
  costPerKg: number;
  costPerCup: number;
  suggestedPrice: number;
  margin: number;
  recommendations: string[];
  user_id: string;
  createdAt?: string;
}
