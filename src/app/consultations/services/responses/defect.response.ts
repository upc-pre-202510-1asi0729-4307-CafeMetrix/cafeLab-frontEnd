export type DefectsResponse = DefectResource[];

export interface DefectResource {
  id: number
  coffeeId: string
  name: string
  defectType: string
  defectWeight: number
  percentage: number
  probableCause: string
  suggestedSolution: string
}
