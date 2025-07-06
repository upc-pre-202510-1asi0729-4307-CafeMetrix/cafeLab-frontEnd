import { Component } from '@angular/core';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import {User} from '../../model/user.entity';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/AuthService';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class LoginFormComponent extends BaseFormComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    super();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          // Agrega un log de debugging
          console.log('Token después de login:', this.authService['tokenService'].getToken());
          // Ahora el token ya está, así que cualquier request llevará el Authorization correcto
          this.userService.getUserByEmail(email).subscribe({
            next: (user: User) => {
              if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (user.hasPlan) {
                  this.router.navigate(['login/success']);
                } else {
                  this.router.navigate(['/select-plan']);
                }
              } else {
                console.error('Usuario no encontrado tras login');
              }
            },
            error: (error: any) => {
              console.error('Error obteniendo usuario por email:', error);
            }
          });
        },
        error: (error: any) => {
          console.error('Login error:', error);
        }
      });
    }
  }


  onRegisterBarista() {
    this.router.navigate(['/register/barista']);
  }

  onRegisterOwner() {
    this.router.navigate(['/register/owner']);
  }


}
