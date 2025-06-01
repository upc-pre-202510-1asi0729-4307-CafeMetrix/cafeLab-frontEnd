@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  submitPayment(paymentData: PaymentData): Observable<any> {
    // Aquí se conecta con la API real o se simula una respuesta
    return of({ success: true });
  }
}
