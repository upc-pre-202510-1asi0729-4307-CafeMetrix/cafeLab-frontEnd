import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { ToolbarPlanComponent } from '../toolbar-plan/toolbar-plan.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-confirm-plan',
  templateUrl: './confirm-plan.component.html',
  styleUrls: ['./confirm-plan.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ToolbarPlanComponent,
    MatToolbar
  ]
})
export class ConfirmPlanComponent implements OnInit {
  selectedPlan: any;
  paymentForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedPlan = localStorage.getItem('selectedPlan');
    if (!storedPlan) {
      void this.router.navigate(['/select-plan']);
      return;
    }

    this.selectedPlan = JSON.parse(storedPlan);

    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/\\d{2}$')]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  goBack(): void {
    void this.router.navigate(['/select-plan']);
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.paymentForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    const planType = this.selectedPlan.type;

    switch (planType) {
      case 'owner':
        void this.router.navigate(['/dashboard-owner']);
        break;
      case 'barista':
      case 'full':
        void this.router.navigate(['/page-not-found']);
        break;
    }
  }

  // Métodos para verificar errores específicos
  hasError(field: string, errorType: string): boolean {
    const control = this.paymentForm.get(field);
    return !!(control && control.errors && control.errors[errorType] && (control.touched || this.formSubmitted));
  }

  isFieldInvalid(field: string): boolean {
    const control = this.paymentForm.get(field);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }
}
