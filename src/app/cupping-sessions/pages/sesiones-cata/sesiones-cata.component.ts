import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { FiltroDialogComponent } from '../../components/filtro-dialog/filtro-dialog.component';
import { NuevasCataComponent } from '../../components/nuevas-cata/nuevas-cata.component';
import { DetallesCataComponent } from '../../components/detalles-cata/detalles-cata.component';
import { CuppingSessionService } from '../../services/cupping-session.service';
import { CuppingSession } from '../../model/cupping-session.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';

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
    MatDialogModule,
    MatSnackBarModule,
    ToolbarComponent,
    FormsModule,
    DetallesCataComponent,
    TranslateModule,
    MatToolbarModule,
    DatePipe
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

  filtros = {
    origen: '',
    variedad: '',
    fecha: null as string | null,
    procesamiento: ''
  };

  constructor(
    private dialog: MatDialog,
    private cuppingSessionService: CuppingSessionService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerSesiones();
  }

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

  get sesionesFiltradas(): CuppingSession[] {
    const q = this.searchText.toLowerCase().trim();
    return this.sesiones
      .filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        s.origen.toLowerCase().includes(q) ||
        s.variedad.toLowerCase().includes(q)
      )
      .filter(s =>
        (!this.filtros.origen || s.origen === this.filtros.origen) &&
        (!this.filtros.variedad || s.variedad === this.filtros.variedad) &&
        (!this.filtros.procesamiento || s.procesamiento === this.filtros.procesamiento) &&
        (!this.filtros.fecha || new Date(s.fecha).toISOString().split('T')[0] === new Date(this.filtros.fecha).toISOString().split('T')[0])
      );
  }

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

  mostrarFiltros(): void {
    const dialogRef = this.dialog.open(FiltroDialogComponent, {
      width: '600px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filtros = result;
      }
    });
  }

  verDetalle(sesion: CuppingSession): void {
    this.sesionSeleccionada = sesion;
    this.mostrarDetalle = true;
  }

  toggleComparacion(): void {
    this.mostrarComparacion = !this.mostrarComparacion;
  }

  iniciarNuevaCata(): void {
    const dialogRef = this.dialog.open(NuevasCataComponent, {
      width: '500px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((nueva) => {
      if (nueva) {
        const nuevaSesion: Omit<CuppingSession, 'id' | 'fecha'> = {
          nombre: nueva.nombre,
          lote: '', // Se eliminó la vinculación con lote específico
          perfil_tueste: nueva.perfilId,
          origen: 'Por definir', // Estos valores deberían venir del perfil seleccionado
          variedad: 'Por definir',
          procesamiento: 'Lavado',
          favorito: false,
          user_id: 'user1' // Reemplazar con el ID del usuario actual
        };
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

  confirmarEliminacion(sesion: CuppingSession): void {
    const confirmMessage = this.translate.instant('CUPPING_SESSIONS.CONFIRM_DELETE', { name: sesion.nombre });
    const confirmTitle = this.translate.instant('CUPPING_SESSIONS.DELETE_SESSION_TITLE');
    
    if (confirm(`${confirmTitle}\n\n${confirmMessage}`)) {
      this.eliminarSesion(sesion);
    }
  }

  private eliminarSesion(sesion: CuppingSession): void {
    if (!sesion.id) {
      this.snackBar.open(
        this.translate.instant('CUPPING_SESSIONS.DELETE_ERROR'),
        this.translate.instant('CUPPING_SESSIONS.CLOSE'),
        { duration: 3000 }
      );
      return;
    }

    this.cuppingSessionService.delete(sesion.id).subscribe({
      next: () => {
        // Remover la sesión de la lista local
        const index = this.sesiones.findIndex(s => s.id === sesion.id);
        if (index !== -1) {
          this.sesiones.splice(index, 1);
        }
        
        // Mostrar mensaje de éxito
        this.snackBar.open(
          this.translate.instant('CUPPING_SESSIONS.DELETE_SUCCESS', { name: sesion.nombre }),
          this.translate.instant('CUPPING_SESSIONS.CLOSE'),
          { duration: 3000 }
        );

        // Si estamos mostrando el detalle de la sesión eliminada, cerrar la vista
        if (this.mostrarDetalle && this.sesionSeleccionada?.id === sesion.id) {
          this.mostrarDetalle = false;
          this.sesionSeleccionada = null;
        }
      },
      error: (err: any) => {
        console.error('Error al eliminar sesión de cata', err);
        this.snackBar.open(
          this.translate.instant('CUPPING_SESSIONS.DELETE_ERROR'),
          this.translate.instant('CUPPING_SESSIONS.CLOSE'),
          { duration: 3000 }
        );
      }
    });
  }
}
