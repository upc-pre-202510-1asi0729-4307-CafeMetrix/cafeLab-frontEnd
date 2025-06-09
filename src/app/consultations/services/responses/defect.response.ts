export interface DefectsResponse {
  status:string
  defects: DefectResource[]
}
export interface DefectResource {
  id: number
  coffeeId: number
  name: string
  defectType: string
  defectWeight: number
  percentage: number
  probableCause: string
  suggestedSolution: string
}
