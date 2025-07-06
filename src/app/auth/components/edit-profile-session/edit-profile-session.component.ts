import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { User } from '../../model/user.entity';
import { NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile-session',
  templateUrl: './edit-profile-session.component.html',
  styleUrls: ['./edit-profile-session.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    NgClass
  ]
})
export class EditProfileSessionComponent extends BaseFormComponent implements OnInit {

  editProfileForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    super();
    this.editProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cafeteriaName: [''],
      experience: [''],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.editProfileForm.patchValue({
        name: this.currentUser.name || '',
        email: this.currentUser.email || '',
        cafeteriaName: this.currentUser.cafeteriaName || '',
        experience: this.currentUser.experience || '',
        paymentMethod: this.currentUser.paymentMethod || ''
      });

      if (this.currentUser.role === 'barista') {
        this.editProfileForm.get('cafeteriaName')?.disable();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.editProfileForm.valid && this.currentUser) {
      const { name, email, cafeteriaName, experience, paymentMethod } = this.editProfileForm.value;

      const updatedUser: User = {
        ...this.currentUser,
        name,
        email,
        cafeteriaName: cafeteriaName || '',
        experience,
        paymentMethod
      };

      this.userService.updateProfile(this.currentUser.id, updatedUser).subscribe({
        next: (user: User) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService.logout();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
        }
      });
    }
  }

  goToChangePlan(): void {
    this.router.navigate(['/subscription/change-plan']);
  }
}
