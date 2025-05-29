import { Component } from '@angular/core';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.entity';

@Component({
  selector: 'app-logup-barista-form',
  templateUrl: './logup-barista-form.component.html',
  styleUrls: ['./logup-barista-form.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class LogupBaristaFormComponent extends BaseFormComponent {
  logupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    super();
    this.logupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.logupForm.valid) {
      const { name, email, password } = this.logupForm.value;
      const newUser: User = {
        id: 0,
        name,
        email,
        password,
        role: 'barista',
        cafeteriaName: '',
        experience: '',
        profilePicture: '',
        paymentMethod: '',
        isFirstLogin: true,
        plan: 'barista',
        hasPlan: false
      };

      this.userService.register(newUser).subscribe({
        next: (user: User) => {
          console.log('Registered user:', user);
          // Redirigir a la página de éxito de registro de barista
          this.router.navigate(['/logup/barista/success']);
        },
        error: (error: any) => {
          console.error('Registration error:', error);
          // Manejar el error de registro, como mostrar un mensaje de error al usuario
        }
      });
    }
  }
}
