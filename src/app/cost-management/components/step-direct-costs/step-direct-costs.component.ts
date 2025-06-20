import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-step-direct-costs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
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
    }
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
