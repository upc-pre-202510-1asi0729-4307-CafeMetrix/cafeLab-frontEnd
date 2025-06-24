export type CalibrationsResponse = CalibrationResource[];

export interface CalibrationResource {
  id: string;
  name: string; // <-- Agrega esto
  method: string;
  equipment: string;
  grindNumber: string;
  aperture: number;
  cupVolume: number;
  finalVolume: number;
  calibrationDate: string;
  comments: string;
  notes: string;
  userId: string;
  sampleImage?: string | null; // <-- Agrega esto si usas imagen
}
