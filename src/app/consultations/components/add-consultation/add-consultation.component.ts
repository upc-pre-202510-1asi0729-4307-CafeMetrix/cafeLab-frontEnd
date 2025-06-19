import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CoffeeService } from '../../services/coffe.service';
import { DefectService } from '../../services/defect.service';
import { Coffee } from '../../model/coffe.entity';
import { Defect } from '../../model/defect.entity';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import { AuthService } from '../../../auth/services/AuthService'; // IMPORTANTE

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatButton
  ],
  styleUrls: ['./add-consultation.component.css']
})
export class AddConsultationComponent implements OnInit {
  defectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coffeeService: CoffeeService,
    private defectService: DefectService,
    private router: Router,
    private authService: AuthService // INYECTA AuthService
  ) {}

  ngOnInit(): void {
    this.defectForm = this.fb.group({
      // Coffee data
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      region: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      variety: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      totalWeight: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],

      // Defect data
      defectName: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$')]],
      defectType: ['', Validators.required],
      defectWeight: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
      percentage: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(100)]],
      probableCause: ['', Validators.required],
      suggestedSolution: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.defectForm.valid) {
      const userId = this.authService.getCurrentUserId(); // OBTIENE EL USER ID

      const coffee: Coffee = new Coffee({
        name: this.defectForm.value.name,
        region: this.defectForm.value.region,
        variety: this.defectForm.value.variety,
        totalWeight: this.defectForm.value.totalWeight,
        userId // ASIGNA EL USER ID
      });

      this.coffeeService.saveCoffee(coffee).subscribe({
        next: (savedCoffee) => {
          const defect: Defect = new Defect({
            id: savedCoffee.id,
            coffeeId: String(savedCoffee.id),
            name: this.defectForm.value.defectName,
            defectType: this.defectForm.value.defectType,
            defectWeight: this.defectForm.value.defectWeight,
            percentage: this.defectForm.value.percentage,
            probableCause: this.defectForm.value.probableCause,
            suggestedSolution: this.defectForm.value.suggestedSolution,
            userId
          });

          this.defectService.saveDefect(defect).subscribe({
            next: () => {
              this.router.navigate(['/libraryDefects']);
            },
            error: (err) => console.error('Error:', err)
          });
        },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/libraryDefects']);
  }
}
