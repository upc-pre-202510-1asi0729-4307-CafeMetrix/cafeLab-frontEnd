import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-step-indirect-costs',
  standalone: true,
  templateUrl: './step-indirect-costs.component.html',
  styleUrls: ['./step-indirect-costs.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
  ]
})
export class StepIndirectCostsComponent {
  @Input() formGroup!: FormGroup;
  @Input() onCancel!: () => void;

  get transportForm(): FormGroup {
    return this.formGroup.get('transport') as FormGroup;
  }

  get storageForm(): FormGroup {
    return this.formGroup.get('storage') as FormGroup;
  }

  get processingForm(): FormGroup {
    return this.formGroup.get('processing') as FormGroup;
  }

  get othersForm(): FormGroup {
    return this.formGroup.get('others') as FormGroup;
  }

  get transportTotal(): number {
    const { costPerKg = 0, quantity = 0 } = this.transportForm.value;
    return costPerKg * quantity;
  }

  get storageTotal(): number {
    const { daysInStorage = 0, dailyCost = 0 } = this.storageForm.value;
    return daysInStorage * dailyCost;
  }

  get processingTotal(): number {
    const p = this.processingForm.value;
    return p.electricity + p.maintenance + p.supplies + p.water + p.depreciation;
  }

  get othersTotal(): number {
    const o = this.othersForm.value;
    return o.qualityControl + o.certifications + o.insurance + o.administrative;
  }
}
