export interface CoffeeLot {
  id?: number;
  lot_name: string;
  coffee_type: string;
  processing_method: string;
  altitude: number;
  weight: number;
  certifications: string[];
  origin: string;
  supplier_id: number;
  userId: number;
  status: string; // 'green' or 'roasted'
}
