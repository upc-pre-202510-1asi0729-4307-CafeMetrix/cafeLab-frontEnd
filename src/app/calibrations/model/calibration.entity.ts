export class Calibration {
  /** Unique identifier for the calibration record */
  id: number;

  /** Selected coffee preparation method (e.g., Espresso) */
  method: string;

  /** Equipment used for calibration (e.g., Maquina Espresso) */
  equipment: string;

  /** Grinding number or range used */
  grindNumber: string;

  /** Aperture size in millimeters */
  aperture: number;

  /** Volume of water in the cup (in mL) */
  cupVolume: number;

  /** Volume of coffee at the end of extraction (in mL) */
  finalVolume: number;

  /** Date of calibration */
  calibrationDate: string;

  /** Optional comments from the calibrator */
  comments: string;

  /** Additional notes (e.g., environmental considerations) */
  notes: string;

  /**
   * Creates a new Calibration instance
   * @param calibration - Initial calibration properties
   */
  constructor(calibration: {
    id?: number;
    method?: string;
    equipment?: string;
    grindNumber?: string;
    aperture?: number;
    cupVolume?: number;
    finalVolume?: number;
    calibrationDate?: string;
    comments?: string;
    notes?: string;
  }) {
    this.id = calibration.id || 0;
    this.method = calibration.method || '';
    this.equipment = calibration.equipment || '';
    this.grindNumber = calibration.grindNumber || '';
    this.aperture = calibration.aperture || 0;
    this.cupVolume = calibration.cupVolume || 0;
    this.finalVolume = calibration.finalVolume || 0;
    this.calibrationDate = calibration.calibrationDate || '';
    this.comments = calibration.comments || '';
    this.notes = calibration.notes || '';

  }
}
