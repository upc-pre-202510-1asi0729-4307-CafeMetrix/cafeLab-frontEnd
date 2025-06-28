import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InventoryService } from '../../services/inventory.service';
import { InventoryEntry } from '../../model/inventory-entry.entity';
import { CoffeeLot } from '../../../coffee-lot/model/coffee-lot.model';
import { AuthService } from '../../../auth/services/AuthService';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ConsumptionSummary {
  lotName: string;
  coffeeType: string;
  status: string;
  totalWeight: number;
  remainingWeight: number;
}

interface PreviousConsumption {
  date: string;
  quantity: number;
}

@Component({
  selector: 'app-register-consumption-dialog',
  standalone: true,
  templateUrl: './register-consumption-dialog.component.html',
  styleUrls: ['./register-consumption-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    TranslatePipe
  ]
})
export class RegisterConsumptionDialogComponent implements OnInit {
  form: FormGroup;
  availableLots: CoffeeLot[] = [];
  consumptionSummary: ConsumptionSummary | null = null;
  previousConsumptions: PreviousConsumption[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterConsumptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { coffeeStatus: string; coffeeType?: string },
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      date: [new Date(), Validators.required],
      lotId: ['', Validators.required],
      finalProduct: ['', Validators.required],
      consumptionKg: [0, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]]
    });

    // Suscribirse a cambios en el formulario para actualizar el resumen
    this.form.valueChanges.subscribe(() => {
      this.updateSummary();
    });
  }

  ngOnInit(): void {
    this.loadAvailableLots();
  }

  loadAvailableLots(): void {
    this.loading = true;
    const userId = this.authService.getCurrentUserId();

    this.inventoryService.getCoffeeLots().pipe(
      catchError(err => {
        console.error('Error loading lots:', err);
        return of([]);
      })
    ).subscribe(lots => {
      // Filtrar lotes por estado y usuario
      this.availableLots = lots.filter(lot => 
        lot.user_id === userId && 
        lot.status === this.data.coffeeStatus
      );
      this.loading = false;
    });
  }

  updateSummary(): void {
    const selectedLotId = this.form.get('lotId')?.value;
    const consumptionKg = this.form.get('consumptionKg')?.value || 0;

    if (selectedLotId) {
      const selectedLot = this.availableLots.find(lot => lot.id === selectedLotId);
      if (selectedLot) {
        // Calcular peso restante (simplificado - en un caso real se calcularía desde el inventario)
        const remainingWeight = Math.max(0, selectedLot.weight - consumptionKg);

        this.consumptionSummary = {
          lotName: selectedLot.lot_name,
          coffeeType: selectedLot.coffee_type,
          status: selectedLot.status,
          totalWeight: selectedLot.weight,
          remainingWeight: remainingWeight
        };

        this.loadPreviousConsumptions(selectedLotId);
      }
    } else {
      this.consumptionSummary = null;
      this.previousConsumptions = [];
    }
  }

  loadPreviousConsumptions(lotId: string): void {
    this.inventoryService.getInventoryEntries().pipe(
      catchError(err => {
        console.error('Error loading previous consumptions:', err);
        return of([]);
      })
    ).subscribe(entries => {
      // Filtrar entradas por lote y ordenar por fecha descendente
      const lotEntries = entries
        .filter(entry => entry.coffeeLotId.toString() === lotId)
        .sort((a, b) => new Date(b.dateUsed).getTime() - new Date(a.dateUsed).getTime())
        .slice(0, 2); // Solo los 2 últimos

      this.previousConsumptions = lotEntries.map(entry => ({
        date: new Date(entry.dateUsed).toLocaleDateString(),
        quantity: entry.quantityUsed
      }));
    });
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload: InventoryEntry = {
        id: 0,
        coffeeLotId: parseInt(formValue.lotId),
        quantityUsed: formValue.consumptionKg,
        dateUsed: formValue.date.toISOString(),
        finalProduct: formValue.finalProduct
      };

      this.dialogRef.close(payload);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getSelectedLotName(): string {
    const lotId = this.form.get('lotId')?.value;
    const lot = this.availableLots.find(l => l.id === lotId);
    return lot ? lot.lot_name : '';
  }
}
