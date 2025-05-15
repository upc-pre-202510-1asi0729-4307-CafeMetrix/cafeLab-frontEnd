import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FiltroDialogComponent } from '../../components/filtro-dialog/filtro-dialog.component';

interface SesionCata {
  nombre: string;
  fecha: string;
  origen: string;
  variedad: string;
  favorito: boolean;
}

@Component({
  selector: 'app-sesiones-cata',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    NavbarComponent,
    FormsModule
  ],
  templateUrl: './sesiones-cata.component.html',
  styleUrls: ['./sesiones-cata.component.css']
})
export class SesionesCataComponent {
  displayedColumns: string[] = ['nombre', 'fecha', 'origen', 'variedad', 'acciones'];
  searchText: string = '';
  mostrarComparacion: boolean = false;

  sesiones: SesionCata[] = [
    { nombre: 'Cata Especial Primavera', fecha: '2024-03-15', origen: 'Perú', variedad: 'Arábica', favorito: false },
    { nombre: 'Evaluación Mensual', fecha: '2024-03-10', origen: 'Colombia', variedad: 'Caturra', favorito: true },
    { nombre: 'Cata Regional Sur', fecha: '2024-03-05', origen: 'Brasil', variedad: 'Bourbon', favorito: false },
    { nombre: 'Análisis Premium', fecha: '2024-02-28', origen: 'Guatemala', variedad: 'Gesha', favorito: false },
    { nombre: 'Cata Orgánica', fecha: '2024-02-20', origen: 'México', variedad: 'Typica', favorito: true }
  ];

  constructor(private dialog: MatDialog) {}

  toggleFavorito(sesion: SesionCata) {
    sesion.favorito = !sesion.favorito;
  }

  mostrarFiltros() {
    const dialogRef = this.dialog.open(FiltroDialogComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí implementaremos la lógica de filtrado
        console.log('Filtros aplicados:', result);
      }
    });
  }

  verDetalle(sesion: SesionCata) {
    // Implementar lógica para ver detalle
  }

  toggleComparacion() {
    this.mostrarComparacion = !this.mostrarComparacion;
  }
} 