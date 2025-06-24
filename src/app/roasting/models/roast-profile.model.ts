export interface RoastProfile {
  id?: string;
  name: string;
  type: string;
  duration: number;
  tempStart: number;
  tempEnd: number;
  isFavorite?: boolean;
  createdAt?: string | Date;
  lot: string;
  user_id?: string;
}
