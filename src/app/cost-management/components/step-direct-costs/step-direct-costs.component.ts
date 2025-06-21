import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-step-direct-costs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    TranslateModule,
    DecimalPipe
  ],
  templateUrl: './step-direct-costs.component.html',
  styleUrls: ['./step-direct-costs.component.css']
})
export class StepDirectCostsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Output() totalsCalculated = new EventEmitter<{ materiaPrima: number; manoObra: number }>();

  totalMateriaPrima = 0;
  totalManoObra = 0;

  ngOnInit(): void {
    if (this.formGroup) {
      this.formGroup.valueChanges.subscribe(() => this.calculateTotals());
      this.calculateTotals(); // Llamada inicial para calcular los totales
    }
  }

  calculateTotals(): void {
    const rawMaterials = this.formGroup.get('rawMaterials')?.value;
    const labor = this.formGroup.get('labor')?.value;

    this.totalMateriaPrima = (rawMaterials?.costPerKg || 0) * (rawMaterials?.quantity || 0);
    this.totalManoObra = (labor?.hoursWorked || 0) * (labor?.costPerHour || 0) * (labor?.numberOfWorkers || 0);

    this.totalsCalculated.emit({
      materiaPrima: this.totalMateriaPrima,
      manoObra: this.totalManoObra
    });
  }
}
