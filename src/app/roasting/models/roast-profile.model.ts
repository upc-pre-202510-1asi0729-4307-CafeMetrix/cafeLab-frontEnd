export interface RoastProfile {
  id?: number;
  name: string;
  type: string;
  duration: number;
  tempStart: number;
  tempEnd: number;
  isFavorite?: boolean;
  createdAt?: string | Date;
  lot: number;
  userId?: number;
}
