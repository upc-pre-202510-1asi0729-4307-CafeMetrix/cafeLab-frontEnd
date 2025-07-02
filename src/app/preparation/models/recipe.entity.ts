export interface Ingredient {
  id: number
  recipeId: number
  name: string
  amount: string
  unit: string
}


export type ExtractionMethod =
  | 'espresso'
  | 'pour-over'
  | 'french-press'
  | 'cold-brew'
  | 'aeropress'
  | 'chemex'
  | 'v60'
  | 'clever'

export interface Recipe {
  id: number
  user_id: number
  name: string
  imageUrl: string
  extractionMethod: ExtractionMethod
  extractionCategory: 'coffee'|'espresso'
  ratio: string
  cuppingSessionId: number
  portfolioId: number | null
  preparationTime: number
  steps: string
  tips?: string
  cupping: string
  grindSize: string
  createdAt: string
  ingredients?: Ingredient[]
}
