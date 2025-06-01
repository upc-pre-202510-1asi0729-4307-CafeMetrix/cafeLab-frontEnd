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
import {NgIf} from '@angular/common';

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
    ReactiveFormsModule,
    NgIf
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      experience: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.logupForm.valid) {
      const { name, email, password, experience } = this.logupForm.value;
      const newUser: User = {
        id: 0,
        name,
        email,
        password,
        experience,
        role: 'barista',
        cafeteriaName: '',
        profilePicture: '',
        paymentMethod: '',
        isFirstLogin: true,
        plan: '',
        hasPlan: false
      };

      this.userService.register(newUser).subscribe({
        next: (user: User) => {
          localStorage.setItem('currentUser', JSON.stringify(user));  // <-- Guarda usuario
          this.router.navigate(['/logup/barista/success']);
        },
        error: (error: any) => {
          console.error('Registration error:', error);
        }
      });
    }
  }
}
