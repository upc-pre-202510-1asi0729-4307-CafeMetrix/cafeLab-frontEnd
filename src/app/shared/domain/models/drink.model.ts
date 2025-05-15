export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Drink {
  id: number;
  name: string;
  image: string;
  extractionMethod: 'coffee' | 'espresso';
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