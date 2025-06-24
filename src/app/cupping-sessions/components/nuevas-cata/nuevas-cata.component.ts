import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
export class NuevasCataComponent {
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

  constructor(private dialogRef: MatDialogRef<NuevasCataComponent>) {}

  crearSesion() {
    if (this.nuevaCata.nombre && this.nuevaCata.loteId && this.nuevaCata.perfilId) {
      this.dialogRef.close(this.nuevaCata);
    }
  }
}
