import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { PlanCardComponentComponent } from '../../components/plan-card-component/plan-card-component.component';
import { PaymentService } from '../../services/payment.service';
import { PaymentData } from '../../model/payment-data.model';

@Component({
  selector: 'app-select-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    PlanCardComponentComponent
  ],
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent {
  paymentForm: FormGroup;
  selectedCard: 'visa' | 'mastercard' = 'visa';
  countries: string[] = ['Peru', 'Chile', 'Colombia', 'Mexico'];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService // 👈 Asegúrate de inyectarlo
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardholderName: ['', [Validators.required]],
      country: ['Peru', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentData = new PaymentData(this.paymentForm.value);
      this.paymentService.submitPayment(paymentData)
        .subscribe(
          response => {
            console.log('Payment success:', response);
          },
          error => {
            console.error('Payment failed:', error);
          }
        );
    } else {
      this.markFormGroupTouched(this.paymentForm);
    }
  }

  selectCard(card: 'visa' | 'mastercard') {
    this.selectedCard = card;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.paymentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('pattern')) {
      switch (controlName) {
        case 'cardNumber':
          return 'Número de tarjeta inválido';
        case 'expiryDate':
          return 'Fecha inválida (MM/YY)';
        case 'cvc':
          return 'CVC inválido';
        default:
          return 'Formato inválido';
      }
    }
    return '';
  }
}
