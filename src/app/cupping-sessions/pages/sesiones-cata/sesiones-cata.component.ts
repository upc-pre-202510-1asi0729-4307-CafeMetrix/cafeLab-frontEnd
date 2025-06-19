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
import {TranslatePipe} from '@ngx-translate/core';

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
    DetalleCataComponent,
    TranslatePipe
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
    private cuppingSessionService: CuppingSessionService
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
    const dialogRef = this.dialog.open(NuevaCataDialogComponent, {
      width: '500px',
      backdropClass: 'dialog-backdrop',
      panelClass: 'filter-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((nueva) => {
      if (nueva) {
        const nuevaSesion: Omit<CuppingSession, 'id' | 'fecha'> = {
          nombre: nueva.nombre,
          lote: nueva.loteId,
          perfil_tueste: nueva.perfilId,
          origen: nueva.origen,
          variedad: nueva.variedad,
          procesamiento: nueva.procesamiento,
          favorito: false,
          user_id: 'user1'
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
}
