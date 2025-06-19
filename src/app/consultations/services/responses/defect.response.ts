export type DefectsResponse = DefectResource[];

export interface DefectResource {
  id: string; // Cambiado de number a string
  coffeeId: string;
  name: string;
  defectType: string;
  defectWeight: number;
  percentage: number;
  probableCause: string;
  suggestedSolution: string;
  userId: string; // Asegúrate de incluir userId si lo usas en el backend
}
