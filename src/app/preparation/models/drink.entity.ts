export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export type CoffeeExtractionType = 'pour-over' | 'french-press' | 'cold-brew' | 'aeropress' | 'chemex' | 'v60' | 'clever';

export interface Drink {
  id: number;
  name: string;
  image: string;
  extractionMethod: 'coffee' | 'espresso';
  extractionType?: CoffeeExtractionType;
  lote: string;
  tueste: string;
  cata: string;
  portfolioId: number | null;
  molienda: string;
  ratio: string;
  preparationTime: string;
  steps: string;
  tips: string;
  ingredients: Ingredient[];
  createdAt: string;
}
