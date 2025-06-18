export class Defect {
  /** Unique identifier for the defect */
  id: number;

  /** ID of the related coffee batch */
  coffeeId: string;

  /** Name of the defect (e.g. Broca, Mold, Immature Bean) */
  name: string;

  /** Type of the defect (Primary or Secondary) */
  defectType: string;

  /** Weight of the defect found (in grams) */
  defectWeight: number;

  /** Percentage of the defect in the batch */
  percentage: number;

  /** Probable cause of the defect */
  probableCause: string;

  /** Suggested solution to avoid or fix the defect */
  suggestedSolution: string;

  /**
   * Creates a new Defect instance
   * @param defect - Initial defect properties
   */
  constructor(defect: {
    id?: number,
    coffeeId?: string,
    name?: string,
    defectType?: string,
    defectWeight?: number,
    percentage?: number,
    probableCause?: string,
    suggestedSolution?: string
  }) {
    this.id = defect.id || 0;
    this.coffeeId = defect.coffeeId || '';
    this.name = defect.name || '';
    this.defectType = defect.defectType || '';
    this.defectWeight = defect.defectWeight || 0;
    this.percentage = defect.percentage || 0;
    this.probableCause = defect.probableCause || '';
    this.suggestedSolution = defect.suggestedSolution || '';
  }
}
