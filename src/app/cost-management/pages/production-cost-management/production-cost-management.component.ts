import { Component, OnInit } from '@angular/core';
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
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component'
import { StepLotSelectionComponent } from '../../components/step-lot-selection/step-lot-selection.component';
import { StepDirectCostsComponent } from '../../components/step-direct-costs/step-direct-costs.component';
import { StepIndirectCostsComponent } from '../../components/step-indirect-costs/step-indirect-costs.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductionCostEntity, ProductionCostCalculation } from "../../model/production-cost.entity";
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { AuthService } from '../../../auth/services/AuthService';
import { ProductionCostService } from '../../services/production-cost.service';
import { CoffeeLotService } from '../../../coffee-lot/services/coffee-lot.service';
import { CoffeeLot } from '../../../coffee-lot/model/coffee-lot.model';

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
    MatTable,
    MatToolbar,
    StepDirectCostsComponent,
    StepIndirectCostsComponent,
    TranslateModule,
    MatTableModule,
    MatToolbarModule,
    MatListModule
  ],
  templateUrl: './production-cost-management.component.html',
  styleUrl: './production-cost-management.component.css'
})
export class ProductionCostPageComponent implements OnInit {
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
  lots: CoffeeLot[] = [];
  loading = false;
  error: string | null = null;
  currentCalculation: ProductionCostCalculation | null = null;

  constructor(private fb: FormBuilder, private router: Router, private translate: TranslateService, private authService: AuthService, private productionCostService: ProductionCostService, private coffeeLotService: CoffeeLotService) {
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

  ngOnInit(): void {
    this.loadLots();
  }

  loadLots(): void {
    this.loading = true;
    const userId = Number(this.authService.getCurrentUserId());
    
    if (!userId || isNaN(userId)) {
      this.error = 'Usuario no autenticado o ID inválido';
      this.loading = false;
      return;
    }

    this.coffeeLotService.getAll().subscribe({
      next: (lots: CoffeeLot[]) => {
        this.lots = lots.filter((lot: CoffeeLot) => Number(lot.userId) === userId);
        this.loading = false;
        this.error = null;
      },
      error: (err: any) => {
        console.error('Error loading lots:', err);
        this.error = 'Error al cargar los lotes';
        this.loading = false;
      }
    });
  }

  saveProductionCost(): void {
    if (!this.isFormValid()) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    const userId = Number(this.authService.getCurrentUserId());
    const selectedLotId = Number(this.firstFormGroup.value.selectedLot);

    if (!userId || !selectedLotId) {
      this.error = 'Datos de usuario o lote inválidos';
      this.isSubmitting = false;
      return;
    }

    // Verificar que el lote seleccionado existe y pertenece al usuario
    const selectedLot = this.lots.find(lot => Number(lot.id) === selectedLotId);
    if (!selectedLot) {
      this.error = 'El lote seleccionado no es válido';
      this.isSubmitting = false;
      return;
    }

    // Calcular resumen y generar recomendaciones
    this.calculateResumen();
    this.generateRecommendations();

    // Calcular costos usando el servicio
    const costCalculation = this.productionCostService.calculateProductionCost({
      coffeeLotId: selectedLotId,
      coffeeLotName: selectedLot.lot_name,
      coffeeType: selectedLot.coffee_type,
      totalKg: this.firstFormGroup.value.rawMaterials?.quantity || 0,
      rawMaterialsCost: this.rawMaterialTotal,
      laborCost: this.laborTotal,
      transportCost: this.transportTotal,
      storageCost: this.storageTotal,
      processingCost: this.processingTotal,
      otherIndirectCosts: this.othersTotal,
      margin: this.EXPECTED_MARGIN
    });

    // Mostrar resultados
    this.isSuccess = true;
    this.registrationCode = `CP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    this.isSubmitting = false;
    this.error = null;
    
    // Guardar el cálculo para el PDF
    this.currentCalculation = costCalculation;
  }

  downloadPDF(): void {
    if (this.currentCalculation) {
      this.productionCostService.generatePDF(this.currentCalculation);
    }
  }

  resetForm(): void {
    this.isSuccess = false;
    this.currentCalculation = null;
    this.registrationCode = '';
    this.error = null;
    this.currentStep = 0;
    
    // Resetear formularios
    this.firstFormGroup.reset();
    this.directCostsForm.reset();
    this.indirectCostsForm.reset();
    
    // Resetear valores por defecto
    this.directCostsForm.patchValue({
      labor: { numberOfWorkers: 1 }
    });
  }

  private isFormValid(): boolean {
    return this.firstFormGroup.valid && 
           this.directCostsForm.valid && 
           this.indirectCostsForm.valid;
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
    this.saveProductionCost();
  }

  onExit(): void {
    this.goToHome();
  }

  onPrint(): void {
    this.downloadPDF();
  }

  goToHome(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    switch (user.plan) {
      case 'barista':
        this.router.navigate(['/dashboard/barista']);
        break;
      case 'owner':
        this.router.navigate(['/dashboard/owner']);
        break;
      case 'full':
        this.router.navigate(['/dashboard/complete']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  updateDirectCosts(event: { materiaPrima: number; manoObra: number }): void {
    this.totalMateriaPrima = event.materiaPrima;
    this.totalManoObra = event.manoObra;
  }

  private generateRecommendations(): void {
    this.recommendations = [];
    // 1. Alto costo directo
    if (this.totalDirectCosts / this.grandTotal > 0.6) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.HIGH_DIRECT_COST'),
        type: 'warning'
      });
    }
    // 2. Alto costo indirecto
    if (this.totalIndirectCosts / this.grandTotal > 0.4) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.HIGH_INDIRECT_COST'),
        type: 'info'
      });
    }
    // 3. Bajo margen de ganancia
    if (this.potentialMargin < 20) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.LOW_MARGIN'),
        type: 'warning'
      });
    }
    // 4. Poca variedad de lotes (menos de 2)
    if (this.firstFormGroup.value.selectedLot && Array.isArray(this.lots) && this.lots.length < 2) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.LOW_LOT_VARIETY'),
        type: 'info'
      });
    }
    // 5. Alto costo por kg
    if (this.costPerKg > 15) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.HIGH_COST_PER_KG'),
        type: 'warning'
      });
    }
    // Si no hay recomendaciones, mostrar éxito
    if (this.recommendations.length === 0) {
      this.recommendations.push({
        message: this.translate.instant('COST_MANAGEMENT.RECOMMENDATIONS.ALL_GOOD'),
        type: 'success'
      });
    }
  }
}
