import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatCard, MatCardHeader} from '@angular/material/card';
import { MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-step-direct-costs',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCard,
    MatCardHeader
  ],
  templateUrl: './step-direct-costs.component.html',
  styleUrl: './step-direct-costs.component.css'
})
export class StepDirectCostsComponent {
  @Input() formGroup!: FormGroup;
  @Input() progressValue = 0;
  @Input() onCancel!: () => void;

}


