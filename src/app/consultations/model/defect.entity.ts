export class Defect {
  /** Unique identifier for the defect */
  id: string;

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

  /** User ID (owner of this defect record) */
  userId: string;

  constructor(defect: {
    id?: string,
    coffeeId?: string,
    name?: string,
    defectType?: string,
    defectWeight?: number,
    percentage?: number,
    probableCause?: string,
    suggestedSolution?: string,
    userId?: string
  }) {
    this.id = defect.id ? String(defect.id) : '';
    this.coffeeId = defect.coffeeId ? String(defect.coffeeId) : '';
    this.name = defect.name || '';
    this.defectType = defect.defectType || '';
    this.defectWeight = defect.defectWeight || 0;
    this.percentage = defect.percentage || 0;
    this.probableCause = defect.probableCause || '';
    this.suggestedSolution = defect.suggestedSolution || '';
    this.userId = defect.userId ? String(defect.userId) : '';
  }
}
