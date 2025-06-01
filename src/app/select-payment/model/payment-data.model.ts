export class PaymentData {
  /** Email del usuario que realiza el pago */
  email: string;

  /** Número de tarjeta de crédito (en formato string) */
  cardNumber: string;

  /** Fecha de expiración de la tarjeta (MM/YY) */
  expiryDate: string;

  /** Código de seguridad (CVC) */
  cvc: string;

  /** Nombre completo del titular de la tarjeta */
  cardholderName: string;

  /** País del titular de la tarjeta */
  country: string;

  constructor(paymentData: {
    email?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    cardholderName?: string;
    country?: string;
  }) {
    this.email = paymentData.email || '';
    this.cardNumber = paymentData.cardNumber || '';
    this.expiryDate = paymentData.expiryDate || '';
    this.cvc = paymentData.cvc || '';
    this.cardholderName = paymentData.cardholderName || '';
    this.country = paymentData.country || '';
  }
}
