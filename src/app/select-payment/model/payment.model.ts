export class Payment {
  id: number;
  email: string;
  amount: number;
  date: string;

  constructor(data: {
    id?: number;
    email?: string;
    amount?: number;
    date?: string;
  }) {
    this.id = data.id || 0;
    this.email = data.email || '';
    this.amount = data.amount || 0;
    this.date = data.date || '';
  }
}
