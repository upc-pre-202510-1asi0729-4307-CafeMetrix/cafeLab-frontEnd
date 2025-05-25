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

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.defectForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      region: ['', Validators.required],
      variety: ['', Validators.required],
      totalWeight: ['', Validators.required],
      defectName: ['', Validators.required],
      defectType: ['', Validators.required],
      defectWeight: ['', Validators.required],
      percentage: ['', Validators.required],
      probableCause: ['', Validators.required],
      suggestedSolution: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.defectForm.valid) {
      const coffee: Coffee = new Coffee({
        id: this.defectForm.value.id,
        name: this.defectForm.value.name,
        region: this.defectForm.value.region,
        variety: this.defectForm.value.variety,
        totalWeight: this.defectForm.value.totalWeight
      });

      const defect: Defect = new Defect({
        id: this.defectForm.value.id, // mismo id que el café
        coffeeId: this.defectForm.value.id,
        name: this.defectForm.value.defectName,
        defectType: this.defectForm.value.defectType,
        defectWeight: this.defectForm.value.defectWeight,
        percentage: this.defectForm.value.percentage,
        probableCause: this.defectForm.value.probableCause,
        suggestedSolution: this.defectForm.value.suggestedSolution
      });

      this.coffeeService.create(coffee).subscribe(() => {
        this.defectService.create(defect).subscribe(() => {
          this.router.navigate(['/libraryDefects']);
        });
      });
    }
  }
}
