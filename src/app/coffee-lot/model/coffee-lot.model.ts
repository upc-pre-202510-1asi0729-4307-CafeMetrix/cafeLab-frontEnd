export interface CoffeeLot {
  id?: string;
  lot_name: string;
  coffee_type: string;
  processing_method: string;
  altitude: number;
  weight: number;
  certifications: string[];
  origin: string;
  supplier_id: string;
  user_id: string;
}
