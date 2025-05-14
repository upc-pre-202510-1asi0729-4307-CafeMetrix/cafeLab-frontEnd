import { Routes } from '@angular/router';
import { SelectPaymentComponent } from './pages/select-payment/select-payment.component';

export const routes: Routes = [
  // ... otras rutas ...
  {
    path: 'select-payment',
    component: SelectPaymentComponent
  },
  {
    path: '',
    redirectTo: 'select-payment',
    pathMatch: 'full'
  }
];
