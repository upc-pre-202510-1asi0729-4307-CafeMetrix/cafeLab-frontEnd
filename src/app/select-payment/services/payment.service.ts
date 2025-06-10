import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Payment } from '../model/payment.model';
import { environment } from '../../../environments/environment';

const PaymentResourceEndpointPath = environment.paymentsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService<Payment> {
  constructor() {
    super();
    this.resourceEndpoint = PaymentResourceEndpointPath;
  }
}
