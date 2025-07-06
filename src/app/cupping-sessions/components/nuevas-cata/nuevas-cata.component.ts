import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../auth/services/AuthService';
import { RoastProfileService } from '../../../roasting/services/roast-profile.service';
import { RoastProfile } from '../../../roasting/models/roast-profile.model';

@Component({
  selector: 'app-nuevas-cata',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './nuevas-cata.component.html',
  styleUrls: ['./nuevas-cata.component.css']
})
export class NuevasCataComponent implements OnInit {
  nuevaCata = {
    nombre: '',
    perfilId: ''
  };

  perfiles: { id: string; nombre: string }[] = [];
  isLoadingProfiles = false;
  userPlan: string = '';

  // Perfiles hardcoded para usuarios barista
  private baristaProfiles = [
    { id: '1', nombre: 'Perfil Ligero - City Roast' },
    { id: '2', nombre: 'Perfil Medio - Full City' },
    { id: '3', nombre: 'Perfil Oscuro - French Roast' }
  ];

  constructor(
    private dialogRef: MatDialogRef<NuevasCataComponent>,
    private authService: AuthService,
    private roastProfileService: RoastProfileService
  ) {}

  ngOnInit() {
    this.loadUserPlan();
    this.loadProfiles();
  }

  private loadUserPlan() {
    const user = this.authService.getCurrentUser();
    this.userPlan = user?.plan || 'barista';
  }

  private loadProfiles() {
    if (this.userPlan === 'barista') {
      // Para usuarios barista, usar perfiles hardcoded
      this.perfiles = this.baristaProfiles;
    } else if (this.userPlan === 'full' || this.userPlan === 'owner') {
      // Para usuarios con plan completo/full, cargar desde el servicio
      this.isLoadingProfiles = true;
      this.roastProfileService.getAll().subscribe({
        next: (profiles: RoastProfile[]) => {
          this.perfiles = profiles.map(profile => ({
            id: profile.id?.toString() || '',
            nombre: profile.name
          }));
          this.isLoadingProfiles = false;
        },
        error: (error) => {
          console.error('Error loading roast profiles:', error);
          // Fallback a perfiles hardcoded en caso de error
          this.perfiles = this.baristaProfiles;
          this.isLoadingProfiles = false;
        }
      });
    } else {
      // Fallback por defecto
      this.perfiles = this.baristaProfiles;
    }
  }

  crearSesion() {
    if (this.nuevaCata.nombre && this.nuevaCata.perfilId) {
      this.dialogRef.close(this.nuevaCata);
    }
  }
}
