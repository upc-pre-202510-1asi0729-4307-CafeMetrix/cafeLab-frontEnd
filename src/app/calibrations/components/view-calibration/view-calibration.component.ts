import { Component, OnInit } from '@angular/core';
import { CalibrationService } from '../../services/calibration.service';
import { Calibration } from '../../model/calibration.entity';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatPrefix, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-view-calibrations',
  templateUrl: './view-calibration.component.html',
  imports: [
    TranslatePipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    FormsModule,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatPrefix,
    MatFormField,
    MatInput,
    NgIf,
    MatHeaderRow,
    MatRow,
    MatButton,
    MatRowDef,
    MatHeaderRowDef
  ],
  styleUrls: ['./view-calibration.component.css']
})
export class ViewCalibrationsComponent implements OnInit {
  calibrationSearch: string = '';
  calibrations: Calibration[] = [];
  filteredCalibrations: Calibration[] = [];
  displayedColumns: string[] = ['nombre', 'metodo', 'equipo', 'apertura', 'acciones'];

  constructor(
    private calibrationService: CalibrationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.calibrationService.getAll().subscribe({
      next: (data: Calibration[]) => {
        this.calibrations = data;
        this.filteredCalibrations = [...this.calibrations];
      },
      error: (err) => console.error('Error al cargar calibraciones:', err)
    });
  }

  filterData() {
    const search = this.calibrationSearch.toLowerCase();
    this.filteredCalibrations = this.calibrations.filter(row =>
      row.method.toLowerCase().includes(search) ||
      row.equipment.toLowerCase().includes(search) ||
      row.grindNumber.toLowerCase().includes(search)
    );
  }

  clearCalibrationSearch() {
    this.calibrationSearch = '';
    this.filterData();
  }

  goToEdit(id: number) {
    this.router.navigate(['/edit-calibration', id]);
  }

  goToMoreInfo(id: number) {
    this.router.navigate(['/more-info-calibration', id]);
  }

  goToAddCalibration() {
    this.router.navigate(['/new-calibration']);
  }
}
