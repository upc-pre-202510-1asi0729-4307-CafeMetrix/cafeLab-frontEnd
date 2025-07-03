import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.entity';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/AuthService';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    NgClass
  ]
})
export class EditProfileFormComponent extends BaseFormComponent implements OnInit {
  editProfileForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    this.editProfileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cafeteriaName: [''],
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.editProfileForm.patchValue({
        name: this.currentUser?.name || '',
        email: this.currentUser?.email || '',
        cafeteriaName: this.currentUser?.cafeteriaName || '',
        experience: this.currentUser?.experience || '',
        paymentMethod: this.currentUser?.paymentMethod || ''
      });

      if (this.currentUser?.role === 'barista') {
        this.editProfileForm.get('cafeteriaName')?.disable();
      }
    }
  }

  onSubmit() {
    if (this.editProfileForm.valid && this.currentUser) {
      const { name, email, cafeteriaName, experience, paymentMethod } = this.editProfileForm.value;
      const updatedProfile: Partial<User> = {
        name,
        email,
        cafeteriaName: cafeteriaName || '',
        experience,
        paymentMethod
      };

      this.userService.updateProfile(this.currentUser.id, updatedProfile).subscribe({
        next: (user: User) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.redirectAfterUpdate();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Update profile error:', error);

          if (error.status === 401 || error.status === 403) {
            // Handle unauthorized or forbidden errors (e.g., redirect to login)
            console.error('Authentication or authorization error:', error.message);
          } else if (error.status === 400) {
            // Handle bad request/validation errors
            console.error('Validation error:', error.error); // error.error might contain server-side validation messages
          } else {
            // Handle other errors
            console.error('An unexpected error occurred:', error.message);
          }
        }
      });
    }
  }

  redirectAfterUpdate() {
    if (this.currentUser?.hasPlan) {
      switch (this.currentUser.plan) {
        case 'barista':
          this.router.navigate(['/dashboard/barista']);
          break;
        case 'owner':
          this.router.navigate(['/dashboard/owner']);
          break;
        case 'full':
          this.router.navigate(['/dashboard/complete']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
    } else {
      this.router.navigate(['/subscription/select-plan']);
    }
  }
  goToChangePlan() {
    this.router.navigate(['/select-plan']);
  }

}
