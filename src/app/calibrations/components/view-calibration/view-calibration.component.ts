import { Component, OnInit } from '@angular/core';
import { CalibrationService } from '../../services/calibration.service';
import { Calibration } from '../../model/calibration.entity';
import { AuthService } from '../../../auth/services/AuthService';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-view-calibration',
  templateUrl: './view-calibration.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    MatFormField,
    MatIconButton,
    MatInput,
    MatPrefix,
    MatButton,
    NgIf,
    FormsModule,
    MatIconModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    ToolbarComponent,
    MatToolbar
  ],
  styleUrls: ['./view-calibration.component.css']
})
export class ViewCalibrationComponent implements OnInit {
  search: string = '';
  calibrations: Calibration[] = [];
  filteredCalibrations: Calibration[] = [];
  displayedColumns: string[] = ['nombre', 'metodo', 'equipo', 'apertura', 'acciones'];

  constructor(
    private calibrationService: CalibrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCalibrations();
  }

  loadCalibrations(): void {
    const currentUserId = this.authService.getCurrentUserId();
    this.calibrationService.getCalibrations().subscribe({
      next: (calibrations: Calibration[]) => {
        this.calibrations = calibrations.filter(c => String(c.userId) === String(currentUserId));
        this.filteredCalibrations = [...this.calibrations];
      },
      error: (err) => console.error('Error loading calibrations:', err)
    });
  }

  filterData() {
    this.filteredCalibrations = this.calibrations.filter(row =>
      !this.search ||
      row.method.toLowerCase().includes(this.search.toLowerCase()) ||
      row.equipment.toLowerCase().includes(this.search.toLowerCase()) ||
      row.grindNumber.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  clearSearch() {
    this.search = '';
    this.filterData();
  }

  goToEdit(calibrationId: string) {
    this.router.navigate(['/edit-calibration', calibrationId]);
  }

  goToView(calibrationId: string) {
    this.router.navigate(['/more-info-calibration', calibrationId]);
  }

  goToRegister() {
    this.router.navigate(['/add-new-calibration']);
  }
}
