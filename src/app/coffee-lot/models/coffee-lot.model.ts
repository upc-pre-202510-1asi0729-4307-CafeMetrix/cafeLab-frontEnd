export interface CoffeeLot {
  id?: number;
  name: string;
  type: string;
  process: string;
  altitude: string;
  weight: string;
  origin: string;
  certifications: string[];
  productionDate?: string;
  providerId?: number;
  providerName?: string;
} 