import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { User } from '../../model/user.entity';
import { AuthService } from '../../services/auth.service';
import {MatFormField} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-signup-owner',
  templateUrl: './signup-owner.component.html',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatCheckbox
  ],
  styleUrls: ['./signup-owner.component.css']
})
export class SignupOwnerComponent implements OnInit {
  signupForm!: FormGroup;
  error: string | null = null;
  success: string | null = null;
  isSubmitting = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cafeteriaName: ['', Validators.required],
      experience: [''],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  };

  async signup(): Promise<void> {
    if (this.signupForm.invalid) {
      return;
    }

    // Reset messages
    this.error = null;
    this.success = null;
    this.isSubmitting = true;

    try {
      const formValue = this.signupForm.value;

      // Check if email already exists
      const existingUser = await this.authService.findUserByEmail(formValue.email);
      if (existingUser) {
        this.error = this.translate.instant('signup.error_email_exists');
        this.isSubmitting = false;
        return;
      }

      // Create a new user with the User entity
      const newUser: User = {
        id: 'o_' + Date.now(),
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        role: 'dueno_cafeteria',
        cafeteriaName: formValue.cafeteriaName,
        experience: formValue.experience,
        isFirstLogin: true
      };

      console.log('Registrando dueño de cafetería:', newUser);

      // Register the user via the AuthService
      await this.authService.register(newUser);

      // Registration successful
      this.success = this.translate.instant('signup.success_message');

      // Redirect to edit profile after a delay
      setTimeout(() => {
        window.location.href = '/edit-profile'; // Hard refresh
        // Alternativa: this.router.navigateByUrl('/edit-profile');
      }, 2000);
    } catch (error) {
      console.error('Error en el registro:', error);
      this.error = this.translate.instant('signup.error_registration');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/login');
  }
}
