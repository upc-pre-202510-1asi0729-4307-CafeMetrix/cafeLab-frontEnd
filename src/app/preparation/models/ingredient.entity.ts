export class Ingredient {
  id: number;
  recipeId: number;
  name: string;
  amount: number;
  unit: string;

  constructor(ingredient: {
    id?: number;
    recipeId: number;
    name: string;
    amount: number;
    unit: string;
  }) {
    this.id = ingredient.id || 0;
    this.recipeId = ingredient.recipeId;
    this.name = ingredient.name;
    this.amount = ingredient.amount;
    this.unit = ingredient.unit;
  }
} 