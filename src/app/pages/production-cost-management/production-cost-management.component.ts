import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-cost-page',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './production-cost-management.component.html',
  styleUrl: './production-cost-management.component.css'
})
export class ProductionCostPageComponent {
  firstFormGroup: FormGroup;
  directCostsForm: FormGroup;
  currentStep = 0;
  totalSteps = 4;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this.firstFormGroup = this._formBuilder.group({
      selectedLot: ['']
    });

    this.directCostsForm = this._formBuilder.group({
      rawMaterials: this._formBuilder.group({
        costPerKg: [''],
        quantity: ['']
      }),
      labor: this._formBuilder.group({
        hoursWorked: [''],
        costPerHour: [''],
        numberOfWorkers: ['']
      })
    });
  }

  get progressValue(): number {
    return (this.currentStep / (this.totalSteps - 1)) * 100;
  }

  get rawMaterialTotal(): number {
    const form = this.directCostsForm.get('rawMaterials')?.value;
    return (form.costPerKg || 0) * (form.quantity || 0);
  }

  get laborTotal(): number {
    const form = this.directCostsForm.get('labor')?.value;
    return (form.hoursWorked || 0) * (form.costPerHour || 0) * (form.numberOfWorkers || 0);
  }

  onCancel(): void {
    // Aquí puedes agregar la lógica para regresar a la vista anterior
    // Por ahora solo navegaremos a la raíz
    this.router.navigate(['/']);
  }
}
