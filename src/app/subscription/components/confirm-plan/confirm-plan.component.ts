import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { ToolbarPlanComponent } from '../toolbar-plan/toolbar-plan.component';
import {MatToolbar} from '@angular/material/toolbar';
import { User } from '../../../auth/model/user.entity';
import {UserService} from '../../../auth/services/user.service';
import { TranslateService} from '@ngx-translate/core';


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
  translatedFeatures: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  sanitizeInput(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
    const controlName = input.getAttribute('formControlName');
    if (controlName) {
      this.paymentForm.get(controlName)?.setValue(input.value);
    }
  }


  ngOnInit(): void {
    const storedPlan = localStorage.getItem('selectedPlan');
    if (!storedPlan) {
      void this.router.navigate(['/select-plan']);
      return;
    }

    this.selectedPlan = JSON.parse(storedPlan);
    this.loadTranslatedFeatures(this.selectedPlan.type);

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslatedFeatures(this.selectedPlan.type);
    });

    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/\\d{2}$')]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadTranslatedFeatures(planType: string): void {
      let featureKey = '';
      switch (planType) {
      case 'barista':
        featureKey = 'PLANS.BARISTA.FEATURES';
        break;
      case 'owner':
        featureKey = 'PLANS.OWNER.FEATURES';
        break;
      case 'full':
        featureKey = 'PLANS.FULL.FEATURES';
        break;
      }

      this.translate.get(featureKey).subscribe((res: string[]) => {
        this.translatedFeatures = res;
      });
    }

  goBack(): void {
    void this.router.navigate(['confirm-plan/select-plan']);
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.paymentForm.invalid) {
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as User;

    const updatedUser: User = {
      ...currentUser,
      hasPlan: true // ✅ Activar el plan solo aquí
    };

    this.userService.updateProfile(currentUser.id, updatedUser).subscribe({
      next: (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));

        const planType = this.selectedPlan.type;


        switch (planType) {
          case 'owner':
            this.router.navigate(['/dashboard/owner']);
            break;
          case 'barista':
            this.router.navigate(['/dashboard/barista']);
            break;
          case 'full':
            this.router.navigate(['/dashboard/complete']);
            break;
          default:
            this.router.navigate(['/page-not-found']);
        }

      },

      error: (err) => {
        console.error('Error updating user after payment:', err);
      }
    });
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
