import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentData } from '../model/payment-data.model';  // o la ruta correcta

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  submitPayment(paymentData: PaymentData): Observable<any> {
    // Aquí se conectaría con la API real
    // return this.http.post('/api/payment', paymentData);

    // Por ahora, simulamos una respuesta exitosa:
    console.log('Enviando pago al servidor:', paymentData);
    return of({ success: true, message: 'Pago procesado correctamente.' });
  }
}
