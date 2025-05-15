import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import {MatFormField} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard
  ],
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {
  loginForm!: FormGroup;
  error: string | null = null;
  isSubmitting = false;
  hidePassword = true;

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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.error = null;
    this.isSubmitting = true;

    try {
      const { email, password } = this.loginForm.value;

      if (!email || !password) {
        this.error = this.translate.instant('login.error_empty_fields');
        this.isSubmitting = false;
        return;
      }

      console.log('Intentando iniciar sesión con:', email, password);

      // Usar el servicio de autenticación para hacer login
      const user = await this.authService.login(email, password);

      if (user) {
        console.log('Usuario autenticado:', user);
        console.log('Rol del usuario:', user.role);

        // Verificar si es un usuario nuevo (sin foto de perfil o método de pago)
        const isNewUser = !user.profilePicture || !user.paymentMethod;

        // Si es un usuario nuevo, redirigirlo a completar su perfil
        if (isNewUser) {
          this.router.navigate(['/edit-profile']);
        } else {
          // Redirigir según el rol del usuario
          if (user.role === 'barista') {
            this.router.navigate(['/barista-home']);
          } else if (user.role === 'dueno_cafeteria') {
            this.router.navigate(['/owner-home']);
          }
        }
      } else {
        this.error = this.translate.instant('login.error_invalid_credentials');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      this.error = this.translate.instant('login.error_login');
    } finally {
      this.isSubmitting = false;
    }
  }
}
