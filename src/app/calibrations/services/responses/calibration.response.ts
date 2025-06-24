export type CalibrationsResponse = CalibrationResource[];

export interface CalibrationResource {
  id: string;
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
}
