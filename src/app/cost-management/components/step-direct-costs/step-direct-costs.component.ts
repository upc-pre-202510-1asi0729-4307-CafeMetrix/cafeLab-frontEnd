import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-step-direct-costs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './step-direct-costs.component.html',
  styleUrl: './step-direct-costs.component.css'
})
export class StepDirectCostsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() progressValue = 0;
  @Input() onCancel!: () => void;
  @Output() totalsCalculated = new EventEmitter<{ materiaPrima: number; manoObra: number }>();


  totalMateriaPrima = 0;
  totalManoObra = 0;

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => this.calculateTotals());
  }

  calculateTotals(): void {
    const costoKg = this.formGroup.get('costoKgCafe')?.value || 0;
    const cantidad = this.formGroup.get('cantidadKgCafe')?.value || 0;
    const horas = this.formGroup.get('horas')?.value || 0;
    const costoHora = this.formGroup.get('costoHora')?.value || 0;
    const trabajadores = this.formGroup.get('trabajadores')?.value || 0;

    this.totalMateriaPrima = costoKg * cantidad;
    this.totalManoObra = horas * costoHora * trabajadores;
    this.totalsCalculated.emit({
      materiaPrima: this.totalMateriaPrima,
      manoObra: this.totalManoObra
    });

  }
}
