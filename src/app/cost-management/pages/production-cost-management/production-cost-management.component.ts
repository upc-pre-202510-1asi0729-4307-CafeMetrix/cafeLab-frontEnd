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
import { Router } from '@angular/router';
import { MetricsCardComponent } from '../../components/metrics-card/metrics-card.component';
import { RecommendationsCardComponent } from '../../components/recommendation-cards/recommendation-cards.component';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { StepLotSelectionComponent } from '../../components/step-lot-selection/step-lot-selection.component';
import { StepDirectCostsComponent } from '../../components/step-direct-costs/step-direct-costs.component';
import { StepIndirectCostsComponent } from '../../components/step-indirect-costs/step-indirect-costs.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProductionCostEntity } from "../../model/production-cost.entity";
import {MatTable} from '@angular/material/table';

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
    MetricsCardComponent,
    RecommendationsCardComponent,
    ToolbarComponent,
    StepLotSelectionComponent,
    StepDirectCostsComponent,
    StepIndirectCostsComponent,
    TranslateModule,
    MatTable
  ],
  templateUrl: './production-cost-management.component.html',
  styleUrl: './production-cost-management.component.css'
})
export class ProductionCostPageComponent {
  firstFormGroup!: FormGroup;
  directCostsForm!: FormGroup;
  indirectCostsForm!: FormGroup;
  currentStep = 0;
  totalSteps = 3;
  totalMateriaPrima = 0;
  totalManoObra = 0;
  isSubmitting = false;
  readonly CUPS_PER_KG = 20;
  isSuccess = false;
  registrationCode = '';
  readonly EXPECTED_MARGIN = 45;
  readonly TRANSPORT_COST_THRESHOLD = 10;
  recommendations: { message: string; type: 'success' | 'warning' | 'info' }[] = [];
  costSummary: { tipo: string; monto: number }[] = [];
  private totalCost: number | undefined;

  constructor(private fb: FormBuilder, private router: Router) {
    this.firstFormGroup = this.fb.group({
      selectedLot: ['', Validators.required]
    });

    this.directCostsForm = this.fb.group({
      rawMaterials: this.fb.group({
        costPerKg: [0, [Validators.required, Validators.min(0)]],
        quantity: [0, [Validators.required, Validators.min(0)]]
      }),
      labor: this.fb.group({
        hoursWorked: [0, [Validators.required, Validators.min(0)]],
        costPerHour: [0, [Validators.required, Validators.min(0)]],
        numberOfWorkers: [1, [Validators.required, Validators.min(1)]]
      })
    });

    this.indirectCostsForm = this.fb.group({
      transport: this.fb.group({
        costPerKg: [0, [Validators.required, Validators.min(0)]],
        quantity: [0, [Validators.required, Validators.min(0)]]
      }),
      storage: this.fb.group({
        daysInStorage: [0, [Validators.required, Validators.min(0)]],
        dailyCost: [0, [Validators.required, Validators.min(0)]]
      }),
      processing: this.fb.group({
        electricity: [0, [Validators.required, Validators.min(0)]],
        maintenance: [0, [Validators.required, Validators.min(0)]],
        supplies: [0, [Validators.required, Validators.min(0)]],
        water: [0, [Validators.required, Validators.min(0)]],
        depreciation: [0, [Validators.required, Validators.min(0)]]
      }),
      others: this.fb.group({
        qualityControl: [0, [Validators.required, Validators.min(0)]],
        certifications: [0, [Validators.required, Validators.min(0)]],
        insurance: [0, [Validators.required, Validators.min(0)]],
        administrative: [0, [Validators.required, Validators.min(0)]]
      })
    });
  }

  onCancel = () => {
    this.router.navigate(['/']);
  };

  onSaveAsDraft(): void {
    const draft = {
      firstStep: this.firstFormGroup.value,
      directCosts: this.directCostsForm.value,
      indirectCosts: this.indirectCostsForm.value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('costManagementDraft', JSON.stringify(draft));
  }

  get progressValue(): number {
    return (this.currentStep / (this.totalSteps - 1)) * 100;
  }

  get rawMaterialTotal(): number {
    const { costPerKg, quantity } = this.directCostsForm.get('rawMaterials')?.value || {};
    return costPerKg * quantity;
  }

  get laborTotal(): number {
    const { hoursWorked, costPerHour, numberOfWorkers } = this.directCostsForm.get('labor')?.value || {};
    return hoursWorked * costPerHour * numberOfWorkers;
  }

  get transportTotal(): number {
    const { costPerKg, quantity } = this.indirectCostsForm.get('transport')?.value || {};
    return costPerKg * quantity;
  }

  get storageTotal(): number {
    const { daysInStorage, dailyCost } = this.indirectCostsForm.get('storage')?.value || {};
    return daysInStorage * dailyCost;
  }

  get processingTotal(): number {
    const p = this.indirectCostsForm.get('processing')?.value || {};
    return p.electricity + p.maintenance + p.supplies + p.water + p.depreciation;
  }

  get othersTotal(): number {
    const o = this.indirectCostsForm.get('others')?.value || {};
    return o.qualityControl + o.certifications + o.insurance + o.administrative;
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
    return this.grandTotal / (this.directCostsForm.get('rawMaterials')?.value.quantity || 1);
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

  getCostCategories() {
    return [
      { category: 'Materia Prima', amount: this.rawMaterialTotal },
      { category: 'Mano de Obra Directa', amount: this.laborTotal },
      { category: 'Transporte', amount: this.transportTotal },
      { category: 'Almacenamiento', amount: this.storageTotal },
      { category: 'Procesamiento', amount: this.processingTotal },
      { category: 'Otros', amount: this.othersTotal }
    ].map(c => ({ ...c, percentage: (c.amount / this.grandTotal) * 100 }));
  }

  calculateResumen(): void {
    this.costSummary = [
      { tipo: 'Materia Prima', monto: this.totalMateriaPrima },
      { tipo: 'Mano de Obra Directa', monto: this.totalManoObra },
      { tipo: 'Costos Indirectos', monto: this.totalIndirectCosts },
    ];

  }

  onSubmit(): void {
    if (this.firstFormGroup.valid && this.directCostsForm.valid && this.indirectCostsForm.valid) {
      this.calculateResumen();
      this.isSubmitting = true;
      const year = new Date().getFullYear();
      const random = Math.floor(10000 + Math.random() * 90000);
      this.registrationCode = `RC-${year}-${random}`;
      this.generateRecommendations();
      setTimeout(() => {
        this.isSubmitting = false;
        this.isSuccess = true;
      }, 1000);
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

    const transportPct = (this.transportTotal / this.grandTotal) * 100;
    if (transportPct > this.TRANSPORT_COST_THRESHOLD) {
      this.recommendations.push({
        message: `Los costos de transporte representan ${transportPct.toFixed(1)}% del total. Considere optimizar la logística.`,
        type: 'warning'
      });
    }

    const processingPct = (this.processingTotal / this.grandTotal) * 100;
    if (processingPct > 30) {
      this.recommendations.push({
        message: 'Los costos de procesamiento son elevados. Evalúe la eficiencia de los equipos y procesos.',
        type: 'info'
      });
    }
  }

  updateDirectCosts(event: { materiaPrima: number; manoObra: number }): void {
    this.totalMateriaPrima = event.materiaPrima;
    this.totalManoObra = event.manoObra;
  }
}
