import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-filtro-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    TranslatePipe
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ 'CUPPING_SESSIONS.FILTER_TITLE' | translate }}</h2>

      <div class="filters-grid">
        <div class="filter-item">
          <mat-form-field appearance="outline">
            <mat-label>Origen</mat-label>
            <mat-select [(ngModel)]="filtros.origen">
              <mat-option value="peru">Perú</mat-option>
              <mat-option value="colombia">Colombia</mat-option>
              <mat-option value="brasil">Brasil</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="filter-item">
          <mat-form-field appearance="outline">
            <mat-label>Variedad</mat-label>
            <mat-select [(ngModel)]="filtros.variedad">
              <mat-option value="arabica">Arábica</mat-option>
              <mat-option value="caturra">Caturra</mat-option>
              <mat-option value="bourbon">Bourbon</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="filter-item">
          <mat-form-field appearance="outline">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="filtros.fecha">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="filter-item">
          <mat-form-field appearance="outline">
            <mat-label>Procesamiento</mat-label>
            <mat-select [(ngModel)]="filtros.procesamiento">
              <mat-option value="lavado">Lavado</mat-option>
              <mat-option value="natural">Natural</mat-option>
              <mat-option value="honey">Honey</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="actions">
        <button mat-raised-button class="apply-button" (click)="aplicarFiltros()">
          Aplicar filtro
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 2rem;
      background-color: #F3F3F3;
      border-radius: 12px;
      min-width: 600px;
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

    .filters-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .filter-item {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    .apply-button {
      background-color: #414535 !important;
      color: white !important;
      padding: 0.5rem 2rem;
    }
  `]
})
export class FiltroDialogComponent {
  filtros = {
    origen: '',
    variedad: '',
    fecha: null,
    procesamiento: ''
  };

  constructor(private dialogRef: MatDialogRef<FiltroDialogComponent>) {}

  aplicarFiltros() {
    this.dialogRef.close(this.filtros);
  }
}
