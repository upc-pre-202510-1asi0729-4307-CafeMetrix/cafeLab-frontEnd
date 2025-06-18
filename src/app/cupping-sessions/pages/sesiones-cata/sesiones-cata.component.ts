import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { FiltroDialogComponent } from '../../components/filtro-dialog/filtro-dialog.component';
import { NuevaCataDialogComponent } from '../../components/nueva-cata-dialog/nueva-cata-dialog.component';
import { DetalleCataComponent } from '../../components/detalle-cata/detalle-cata.component';
import { CuppingSessionService } from '../../services/cupping-session.service';
import { CuppingSession } from '../../model/cupping-session.entity';

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
    ToolbarComponent,
    FormsModule,
    FiltroDialogComponent,
    NuevaCataDialogComponent,
    DetalleCataComponent
  ],
  templateUrl: './sesiones-cata.component.html',
  styleUrls: ['./sesiones-cata.component.css']
})
export class SesionesCataComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'fecha', 'origen', 'variedad', 'acciones'];
  searchText: string = '';
  mostrarComparacion: boolean = false;
  mostrarDetalle: boolean = false;
  sesionSeleccionada: CuppingSession | null = null;
  sesiones: CuppingSession[] = [];

  constructor(
    private dialog: MatDialog,
    private cuppingSessionService: CuppingSessionService
  ) {}

  ngOnInit(): void {
    this.obtenerSesiones();
  }

  /** Obtiene las sesiones del backend (mockAPI por ahora) */
  obtenerSesiones(): void {
    this.cuppingSessionService.getAll().subscribe({
      next: (data) => {
        this.sesiones = data;
      },
      error: (err) => {
        console.error('Error al obtener sesiones de cata', err);
      }
    });
  }

  /** Alterna si es favorito y actualiza la sesión en el backend */
  toggleFavorito(sesion: CuppingSession): void {
    const actualizado = { ...sesion, favorito: !sesion.favorito };
    this.cuppingSessionService.update(actualizado.id!, actualizado).subscribe({
      next: () => {
        sesion.favorito = actualizado.favorito;
      },
      error: (err) => {
        console.error('Error al actualizar favorito', err);
      }
    });
  }

  /** Abre el diálogo de filtros (no implementado aún) */
  mostrarFiltros(): void {
    const dialogRef = this.dialog.open(FiltroDialogComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Filtros aplicados:', result);
        // implementar filtrado si deseas
      }
    });
  }

  /** Muestra el detalle de una sesión */
  verDetalle(sesion: CuppingSession): void {
    this.sesionSeleccionada = sesion;
    this.mostrarDetalle = true;
  }

  /** Alterna la vista de comparación */
  toggleComparacion(): void {
    this.mostrarComparacion = !this.mostrarComparacion;
  }

  /** Abre el diálogo para crear una nueva sesión de cata */
  iniciarNuevaCata(): void {
    const dialogRef = this.dialog.open(NuevaCataDialogComponent, {
      width: '500px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((nueva) => {
      if (nueva) {
        const nuevaSesion = {
          nombre: nueva.nombre || 'Sin nombre',
          lote: nueva.loteId,
          perfil_tueste: nueva.perfilId,
          origen: 'Por definir',
          variedad: 'Por definir',
          favorito: false,
          user_id: 'user1'
        } as Omit<CuppingSession, 'id' | 'fecha'>;

        this.cuppingSessionService.add(nuevaSesion).subscribe({
          next: (creada) => {
            this.sesiones.push(creada);
          },
          error: (err) => {
            console.error('Error al crear sesión de cata', err);
          }
        });
      }
    });
  }
}
