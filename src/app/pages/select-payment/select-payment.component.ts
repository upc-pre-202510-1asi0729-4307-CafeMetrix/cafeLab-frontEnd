import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent {
  paymentForm: FormGroup;
  selectedCard: 'visa' | 'mastercard' = 'visa';
  countries: string[] = ['Peru', 'Chile', 'Colombia', 'Mexico'];

  constructor(private fb: FormBuilder) {
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
      console.log('Form submitted:', this.paymentForm.value);
      // Aquí iría la lógica para procesar el pago
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
} 