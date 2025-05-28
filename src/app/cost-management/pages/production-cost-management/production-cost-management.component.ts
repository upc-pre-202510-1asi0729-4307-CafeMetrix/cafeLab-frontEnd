import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';

interface Recommendation {
  message: string;
  type: 'success' | 'warning' | 'info';
}

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
  firstFormGroup!: FormGroup;
  directCostsForm!: FormGroup;
  indirectCostsForm!: FormGroup;
  currentStep = 0;
  totalSteps = 4;
  isSubmitting = false;
  readonly CUPS_PER_KG = 20; // Constante para el cálculo de costo por taza
  isSuccess = false;
  registrationCode = '';
  readonly EXPECTED_MARGIN = 45; // Margen potencial esperado en porcentaje
  readonly TRANSPORT_COST_THRESHOLD = 10; // Porcentaje máximo esperado para costos de transporte
  recommendations: Recommendation[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this.firstFormGroup = this._formBuilder.group({
      selectedLot: ['', [Validators.required]]
    });

    this.directCostsForm = this._formBuilder.group({
      rawMaterials: this._formBuilder.group({
        costPerKg: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(0)]]
      }),
      labor: this._formBuilder.group({
        hoursWorked: ['', [Validators.required, Validators.min(0)]],
        costPerHour: ['', [Validators.required, Validators.min(0)]],
        numberOfWorkers: ['', [Validators.required, Validators.min(1)]]
      })
    });

    this.indirectCostsForm = this._formBuilder.group({
      transport: this._formBuilder.group({
        costPerKg: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(0)]]
      }),
      storage: this._formBuilder.group({
        daysInStorage: ['', [Validators.required, Validators.min(0)]],
        dailyCost: ['', [Validators.required, Validators.min(0)]]
      }),
      processing: this._formBuilder.group({
        electricity: ['', [Validators.required, Validators.min(0)]],
        maintenance: ['', [Validators.required, Validators.min(0)]],
        supplies: ['', [Validators.required, Validators.min(0)]],
        water: ['', [Validators.required, Validators.min(0)]],
        depreciation: ['', [Validators.required, Validators.min(0)]]
      }),
      others: this._formBuilder.group({
        qualityControl: ['', [Validators.required, Validators.min(0)]],
        certifications: ['', [Validators.required, Validators.min(0)]],
        insurance: ['', [Validators.required, Validators.min(0)]],
        administrative: ['', [Validators.required, Validators.min(0)]]
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

  get transportTotal(): number {
    const form = this.indirectCostsForm.get('transport')?.value;
    return (form.costPerKg || 0) * (form.quantity || 0);
  }

  get storageTotal(): number {
    const form = this.indirectCostsForm.get('storage')?.value;
    return (form.daysInStorage || 0) * (form.dailyCost || 0);
  }

  get processingTotal(): number {
    const form = this.indirectCostsForm.get('processing')?.value;
    return (
      (form.electricity || 0) +
      (form.maintenance || 0) +
      (form.supplies || 0) +
      (form.water || 0) +
      (form.depreciation || 0)
    );
  }

  get othersTotal(): number {
    const form = this.indirectCostsForm.get('others')?.value;
    return (
      (form.qualityControl || 0) +
      (form.certifications || 0) +
      (form.insurance || 0) +
      (form.administrative || 0)
    );
  }

  get totalDirectCosts(): number {
    return this.rawMaterialTotal + this.laborTotal;
  }

  get totalIndirectCosts(): number {
    return this.transportTotal + this.storageTotal + this.processingTotal + this.othersTotal;
  }

  get grandTotal(): number {
    return this.totalDirectCosts + this.totalIndirectCosts;
  }

  get costPerKg(): number {
    const rawMaterials = this.directCostsForm.get('rawMaterials')?.value;
    return rawMaterials.costPerKg || 0;
  }

  get costPerCup(): number {
    return this.costPerKg / this.CUPS_PER_KG;
  }

  get potentialMargin(): number {
    const suggestedPrice = this.suggestedPrice;
    const costPerKg = this.costPerKg;
    return ((suggestedPrice - costPerKg) / suggestedPrice) * 100;
  }

  get suggestedPrice(): number {
    return this.costPerKg * (1 + this.EXPECTED_MARGIN / 100);
  }

  getPercentage(value: number): number {
    return (value / this.grandTotal) * 100;
  }

  getCostCategories() {
    return [
      {
        category: 'Materia Prima',
        amount: this.rawMaterialTotal,
        percentage: this.getPercentage(this.rawMaterialTotal)
      },
      {
        category: 'Mano de Obra Directa',
        amount: this.laborTotal,
        percentage: this.getPercentage(this.laborTotal)
      },
      {
        category: 'Transporte',
        amount: this.transportTotal,
        percentage: this.getPercentage(this.transportTotal)
      },
      {
        category: 'Almacenamiento',
        amount: this.storageTotal,
        percentage: this.getPercentage(this.storageTotal)
      },
      {
        category: 'Procesamiento',
        amount: this.processingTotal,
        percentage: this.getPercentage(this.processingTotal)
      },
      {
        category: 'Otros Costos',
        amount: this.othersTotal,
        percentage: this.getPercentage(this.othersTotal)
      }
    ];
  }

  getErrorMessage(control: any, fieldName: string): string {
    if (control.hasError('required')) {
      return `El campo ${fieldName} es requerido`;
    }
    if (control.hasError('min')) {
      return `El valor de ${fieldName} debe ser mayor o igual a ${control.errors.min.min}`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.firstFormGroup.valid && this.directCostsForm.valid && this.indirectCostsForm.valid) {
      this.isSubmitting = true;
      
      // Generar código de registro
      const year = new Date().getFullYear();
      const random = Math.floor(10000 + Math.random() * 90000);
      this.registrationCode = `RC-${year}-${random}`;

      // Generar recomendaciones
      this.generateRecommendations();

      // Simular envío al backend
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSuccess = true;
      }, 1000);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onSaveAsDraft(): void {
    const draft = {
      firstStep: this.firstFormGroup.value,
      directCosts: this.directCostsForm.value,
      indirectCosts: this.indirectCostsForm.value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('costManagementDraft', JSON.stringify(draft));
  }

  loadDraft(): void {
    const draft = localStorage.getItem('costManagementDraft');
    if (draft) {
      const data = JSON.parse(draft);
      this.firstFormGroup.patchValue(data.firstStep);
      this.directCostsForm.patchValue(data.directCosts);
      this.indirectCostsForm.patchValue(data.indirectCosts);
    }
  }

  onExit(): void {
    this.router.navigate(['/']);
  }

  onPrint(): void {
    window.print();
  }

  private generateRecommendations(): void {
    this.recommendations = [];

    // Analizar margen potencial
    if (this.potentialMargin >= this.EXPECTED_MARGIN) {
      this.recommendations.push({
        message: 'El margen potencial está dentro del rango esperado.',
        type: 'success'
      });
    } else {
      this.recommendations.push({
        message: 'El margen potencial está por debajo del objetivo. Considere optimizar costos o ajustar precios.',
        type: 'warning'
      });
    }

    // Analizar costos de transporte
    const transportPercentage = this.getPercentage(this.transportTotal);
    if (transportPercentage > this.TRANSPORT_COST_THRESHOLD) {
      this.recommendations.push({
        message: `Los costos de transporte representan ${transportPercentage.toFixed(1)}% del total. Considere optimizar la logística.`,
        type: 'warning'
      });
    }

    // Analizar eficiencia de procesamiento
    const processingPercentage = this.getPercentage(this.processingTotal);
    if (processingPercentage > 30) {
      this.recommendations.push({
        message: 'Los costos de procesamiento son elevados. Evalúe la eficiencia de los equipos y procesos.',
        type: 'info'
      });
    }
  }
}
