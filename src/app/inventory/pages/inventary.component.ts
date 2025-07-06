import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterConsumptionDialogComponent } from '../components/register-consumption-dialog/register-consumption-dialog.component';
import { ConsumptionTableComponent } from '../components/consumption-table/consumption-table.component';
import { ToolbarComponent } from '../../public/components/toolbar/toolbar.component';
import { TranslatePipe } from '@ngx-translate/core';
import { InventoryService } from '../services/inventory.service';
import { CoffeeLot } from '../../coffee-lot/model/coffee-lot.model';
import { MatToolbar } from "@angular/material/toolbar";
import { AuthService } from '../../auth/services/AuthService';
import { SupplierService } from '../../supply/services/supplier.service';
import { Supplier } from '../../supply/models/supplier.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InventoryEntry } from '../model/inventory-entry.entity';
import { Router } from '@angular/router';

interface CoffeeTypeMetrics {
  totalKg: number;
  activeLots: number;
  suppliers: number;
  stockStatus: 'low' | 'adequate';
}

interface CoffeeStatusData {
  arabica: CoffeeTypeMetrics;
  robusta: CoffeeTypeMetrics;
  mezcla: CoffeeTypeMetrics;
  selectedType: string;
}

@Component({
  selector: 'app-inventary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    ToolbarComponent,
    TranslatePipe,
    MatToolbar,
    ConsumptionTableComponent
  ],
  templateUrl: './inventary.component.html',
  styleUrl: './inventary.component.css'
})
export class InventaryComponent implements OnInit {
  coffeeTypes = ['Arábica', 'Robusta', 'Mezcla'];
  coffeeStatuses = ['green', 'roasted'];
  
  greenCoffeeData: CoffeeStatusData = {
    arabica: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    robusta: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    mezcla: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    selectedType: 'Arábica'
  };

  roastedCoffeeData: CoffeeStatusData = {
    arabica: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    robusta: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    mezcla: { totalKg: 0, activeLots: 0, suppliers: 0, stockStatus: 'low' },
    selectedType: 'Arábica'
  };

  lots: CoffeeLot[] = [];
  suppliers: Supplier[] = [];
  consumptionEntries: InventoryEntry[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService,
    private authService: AuthService,
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const userId = Number(this.authService.getCurrentUserId());
  
    if (!userId || isNaN(userId)) {
      this.error = 'Usuario no autenticado o ID inválido';
      this.loading = false;
      return;
    }
  
    forkJoin({
      lots: this.inventoryService.getCoffeeLots().pipe(
        catchError(err => {
          console.error('Error loading lots:', err);
          return of([]);
        })
      ),
      suppliers: this.supplierService.getAll().pipe(
        catchError(err => {
          console.error('Error loading suppliers:', err);
          return of([]);
        })
      ),
      consumptionEntries: this.inventoryService.getInventoryEntries().pipe(
        catchError(err => {
          console.error('Error loading consumption entries:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        // Usar userId consistentemente
        this.lots = data.lots.filter(lot => Number(lot.userId) === userId);
        this.suppliers = data.suppliers.filter((supplier: Supplier) => Number(supplier.userId) === userId);
        this.consumptionEntries = data.consumptionEntries.filter(entry => Number(entry.userId) === userId);
        this.calculateMetrics();
        this.loading = false;
        this.error = null; // Limpiar errores previos
      },
      error: (err) => {
        console.error('Error loading inventory data:', err);
        this.error = 'Error al cargar los datos del inventario';
        this.loading = false;
      }
    });
  }

  calculateMetrics(): void {
    // Calcular métricas para café verde
    this.calculateStatusMetrics('green', this.greenCoffeeData);
    
    // Calcular métricas para café tostado
    this.calculateStatusMetrics('roasted', this.roastedCoffeeData);
  }

  calculateStatusMetrics(status: string, data: CoffeeStatusData): void {
    const statusLots = this.lots.filter(lot => lot.status === status);
    const totalKg = statusLots.reduce((sum, lot) => sum + lot.weight, 0);

    // Calcular métricas por tipo de café
    this.coffeeTypes.forEach(type => {
      const typeLots = statusLots.filter(lot => lot.coffee_type === type);
      const typeTotalKg = typeLots.reduce((sum, lot) => sum + lot.weight, 0);
      const typeSuppliers = new Set(typeLots.map(lot => lot.supplier_id)).size;
      
      // Calcular consumo total para este tipo y estado
      const typeConsumption = this.consumptionEntries
        .filter(entry => {
          const lot = this.lots.find(l => Number(l.id) === Number(entry.coffeeLotId));
          return lot && lot.coffee_type === type && lot.status === status;
        })
        .reduce((sum, entry) => sum + entry.quantityUsed, 0);
      
      // Peso restante después del consumo
      const remainingKg = Math.max(0, typeTotalKg - typeConsumption);
      
      // Determinar stock status (30% del total original)
      const threshold = totalKg * 0.3;
      const stockStatus: 'low' | 'adequate' = remainingKg < threshold ? 'low' : 'adequate';

      data[type.toLowerCase() as keyof Omit<CoffeeStatusData, 'selectedType'>] = {
        totalKg: remainingKg, // Mostrar el peso restante, no el total original
        activeLots: typeLots.length,
        suppliers: typeSuppliers,
        stockStatus
      };
    });
  }

  onTypeChange(status: string, type: string): void {
    if (status === 'green') {
      this.greenCoffeeData.selectedType = type;
    } else {
      this.roastedCoffeeData.selectedType = type;
    }
  }

  getCurrentMetrics(status: string): CoffeeTypeMetrics {
    const data = status === 'green' ? this.greenCoffeeData : this.roastedCoffeeData;
    const type = data.selectedType.toLowerCase() as keyof Omit<CoffeeStatusData, 'selectedType'>;
    return data[type];
  }

  openRegisterConsumptionDialog(status: string): void {
    // Verificar que haya lotes disponibles antes de abrir el diálogo
    const availableLots = this.lots.filter(lot => lot.status === status);
    
    if (availableLots.length === 0) {
      this.error = `No hay lotes de café ${status} disponibles para registrar consumo`;
      return;
    }
  
    const dialogRef = this.dialog.open(RegisterConsumptionDialogComponent, {
      width: '90%',
      maxWidth: '1000px',
      panelClass: 'register-consumption-dialog',
      data: { 
        coffeeStatus: status,
        coffeeType: status === 'green' ? this.greenCoffeeData.selectedType : this.roastedCoffeeData.selectedType,
        availableLots: availableLots // Pasar los lotes disponibles
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Validar que la entrada sea válida antes de enviarla
        const entry: InventoryEntry = { ...result };
        
        // Validación manual en lugar de usar isValid()
        if (!this.isValidInventoryEntry(entry)) {
          this.error = 'Datos de consumo inválidos';
          return;
        }
  
        // Registrar el consumo en el inventario
        this.inventoryService.addInventoryEntry(entry).subscribe({
          next: (createdEntry) => {
            console.log('Consumo registrado:', createdEntry);
            this.error = null; // Limpiar errores previos
            // Recargar datos para actualizar métricas
            this.loadData();
          },
          error: (err) => {
            console.error('Error al registrar consumo:', err);
            this.error = 'Error al registrar el consumo';
          }
        });
      }
    });
  }
  
  // Método de validación manual
  private isValidInventoryEntry(entry: InventoryEntry): boolean {
    const userId = Number(this.authService.getCurrentUserId());
    
    // Verificar que el lote existe y pertenece al usuario
    const lotExists = this.lots.some(lot => 
      Number(lot.id) === Number(entry.coffeeLotId) && 
      Number(lot.userId) === userId
    );
    
    return entry.coffeeLotId > 0 && 
           entry.quantityUsed > 0 && 
           (entry.finalProduct?.trim().length ?? 0) > 0 &&
           Number(entry.userId) === userId &&
           lotExists;
  }

  goToDashboard(): void {
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
}
