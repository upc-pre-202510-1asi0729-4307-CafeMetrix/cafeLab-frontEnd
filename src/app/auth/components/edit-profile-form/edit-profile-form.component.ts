// src/app/auth/components/edit-profile-form/edit-profile-form.component.ts
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
import {MatOption, MatSelect} from '@angular/material/select';

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
    MatSelect,
    MatOption,
  ]
})
export class EditProfileFormComponent extends BaseFormComponent implements OnInit {
  editProfileForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
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
      const updatedUser: User = {
        ...this.currentUser,
        name,
        email,
        cafeteriaName: cafeteriaName || '',
        experience: experience || '',
        paymentMethod,
        isFirstLogin: false
      };

      this.userService.updateProfile(this.currentUser.id, updatedUser).subscribe({
        next: (user: User) => {
          console.log('Updated user:', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          // Redirigir a la página de suscripción AQUI HAY QUE REEMPLAZAR PARA UNIR, ESTE LLEVA A SELECCIONAR UN PLAN
          this.router.navigate(['/subscription/selectplan']);
        },
        error: (error: any) => {
          console.error('Update profile error:', error);
          // Manejar el error de actualización de perfil, como mostrar un mensaje de error al usuario
        }
      });
    }
  }
}
