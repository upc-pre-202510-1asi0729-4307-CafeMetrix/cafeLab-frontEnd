import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CuppingSessionService} from '../../services/cupping-session.service';

@Component({
  selector: 'app-filtro-dialog',
  standalone: true,
  templateUrl: './filtro-dialog.component.html',
  styleUrls: ['./filtro-dialog.component.css'],
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
  ]
})
export class FiltroDialogComponent implements OnInit {
  filtros = {
    origen: '',
    variedad: '',
    fecha: null,
    procesamiento: ''
  };

  origenes: string[] = [];
  variedades: string[] = [];
  procesamientos: string[] = [];

  constructor(private dialogRef: MatDialogRef<FiltroDialogComponent>, private  cuppingSessionService: CuppingSessionService) {   }

  ngOnInit(): void {
    const userId = 'user1';
    this.cuppingSessionService.getDistinctValues(userId).subscribe({
      next: (data) => {
        this.origenes = data.origenes;
        this.variedades = data.variedades;
        this.procesamientos = data.procesamientos;
      },
      error: (err) => {
        console.error('Error cargando filtros dinámicos:', err);
      }
    });
  }

  aplicarFiltros(): void {
    this.dialogRef.close(this.filtros);
  }
}
