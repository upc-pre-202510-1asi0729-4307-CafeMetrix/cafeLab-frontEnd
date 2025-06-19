import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-step-indirect-costs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './step-indirect-costs.component.html',
  styleUrl: './step-indirect-costs.component.css'
})
export class StepIndirectCostsComponent {
  @Input() formGroup!: FormGroup;
  @Input() onCancel!: () => void;
  @Input() progressValue!: number;


  get transport() {
    return this.formGroup.get('transport')!;
  }

  get transportTotal(): number {
    const t = this.formGroup.get('transport')?.value;
    return (t.costPerKg || 0) * (t.quantity || 0);
  }

  get storage() {
    return this.formGroup.get('storage')!;
  }

  get storageTotal(): number {
    const s = this.formGroup.get('storage')?.value;
    return (s.daysInStorage || 0) * (s.dailyCost || 0);
  }

  get processing() {
    return this.formGroup.get('processing')!;
  }

  get others() {
    return this.formGroup.get('others')!;
  }
}
