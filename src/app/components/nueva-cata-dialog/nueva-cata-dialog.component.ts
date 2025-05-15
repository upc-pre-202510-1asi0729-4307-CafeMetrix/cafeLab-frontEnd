import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nueva-cata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Nueva Sesión de Cata</h2>
      
      <div class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Nombre de sesión de cata</mat-label>
          <input matInput [(ngModel)]="nuevaCata.nombre" placeholder="Ingrese el nombre de la sesión">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Lote vinculado</mat-label>
          <mat-select [(ngModel)]="nuevaCata.loteId">
            <mat-option *ngFor="let lote of lotes" [value]="lote.id">
              {{lote.nombre}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Perfil de Tueste</mat-label>
          <mat-select [(ngModel)]="nuevaCata.perfilId">
            <mat-option *ngFor="let perfil of perfiles" [value]="perfil.id">
              {{perfil.nombre}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="actions">
        <button mat-raised-button class="create-button" (click)="crearSesion()">
          Crear nueva sesión de cata
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 2rem;
      background-color: #F3F3F3;
      border-radius: 12px;
      min-width: 400px;
    }

    .dialog-title {
      color: #414535;
      font-family: 'Nunito', sans-serif;
      font-weight: bold;
      font-size: 28px;
      margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #414535;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    mat-form-field {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    .create-button {
      background-color: #414535 !important;
      color: white !important;
      padding: 0.5rem 2rem;
    }
  `]
})
export class NuevaCataDialogComponent {
  nuevaCata = {
    nombre: '',
    loteId: '',
    perfilId: ''
  };

  // Datos de ejemplo - estos deberían venir de un servicio
  lotes = [
    { id: '1', nombre: 'Lote A - Perú Chanchamayo' },
    { id: '2', nombre: 'Lote B - Colombia Huila' },
    { id: '3', nombre: 'Lote C - Brasil Santos' }
  ];

  perfiles = [
    { id: '1', nombre: 'Perfil Ligero - City Roast' },
    { id: '2', nombre: 'Perfil Medio - Full City' },
    { id: '3', nombre: 'Perfil Oscuro - French Roast' }
  ];

  constructor(private dialogRef: MatDialogRef<NuevaCataDialogComponent>) {}

  crearSesion() {
    if (this.nuevaCata.nombre && this.nuevaCata.loteId && this.nuevaCata.perfilId) {
      this.dialogRef.close(this.nuevaCata);
    }
  }
} 