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
    ReactiveFormsModule
  ]
})
export class LoginFormComponent extends BaseFormComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
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
      this.userService.login(email, password).subscribe({
        next: (user: User) => {
          console.log('Logged in user:', user);
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Redirigir al dashboard correspondiente según el plan del usuario AQUI TAMBIEN HAY QUE CAMBIAR SI ES DISTINTO LO QUE TIENES
          switch (user.plan) {
            case 'barista':
              this.router.navigate(['/dashboard/barista']);
              break;
            case 'admin':
              this.router.navigate(['/dashboard/owner']);
              break;
            case 'complete':
              this.router.navigate(['/dashboard/complete']);
              break;
            default:
              console.error('Invalid user plan');
              // Manejar el caso de un plan de usuario inválido
              break;
          }
        },
        error: (error: any) => {
          console.error('Login error:', error);
          // Manejar el error de inicio de sesión, como mostrar un mensaje de error al usuario
        },
        complete: () => {
          // Completar la suscripción (opcional)
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
