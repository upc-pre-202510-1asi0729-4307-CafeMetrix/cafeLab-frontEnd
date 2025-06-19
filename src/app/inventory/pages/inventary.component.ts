import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterConsumptionDialogComponent } from '../../cupping-sessions/components/register-consumption-dialog/register-consumption-dialog.component';
import { ToolbarComponent } from '../../public/components/toolbar/toolbar.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { InventoryEntry } from '../model/inventory-entry.entity';
import { HttpClientModule } from '@angular/common/http';

interface CoffeeStock {
  type: string;
  variety: string;
  total: string;
  stockStatus: string;
  activeLots: number;
  suppliers: number;
  types?: string[];
}

@Component({
  selector: 'app-inventary',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    ToolbarComponent,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './inventary.component.html',
  styleUrl: './inventary.component.css'
})
export class InventaryComponent {
  coffeeStocks: CoffeeStock[] = [
    {
      type: 'Café verde',
      variety: 'Típica',
      total: '10kg',
      stockStatus: 'stock bajo',
      activeLots: 5,
      suppliers: 3
    },
    {
      type: 'Café tostado',
      variety: 'Típica',
      total: '25kg',
      stockStatus: 'stock adecuado',
      activeLots: 4,
      suppliers: 4,
      types: ['Espresso', 'Filtro']
    }
  ];

  displayedColumns: string[] = ['fecha', 'producto', 'lote', 'cantidad', 'acciones'];
  recentMovements: any[] = [];

  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService
  ) {
    this.loadMovements();
  }

  openRegisterConsumptionDialog(): void {
    const dialogRef = this.dialog.open(RegisterConsumptionDialogComponent, {
      width: '80%',
      maxWidth: '1200px',
      panelClass: 'register-consumption-dialog',
      data: { coffeeLotId: 1 } // ← este ID debe cambiar cuando haya integración real
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.addInventoryEntry(result).subscribe({
          next: () => {
            this.loadMovements();
          },
          error: (err) => console.error('Error al guardar consumo:', err)
        });
      }
    });
  }

  loadMovements(): void {
    this.inventoryService.getInventoryEntries().subscribe({
      next: (entries) => {
        this.recentMovements = entries.map(entry => ({
          fecha: entry.dateUsed,
          producto: 'Café', // Esto debería mapearse a algo más específico con coffeeLotId
          lote: entry.coffeeLotId,
          cantidad: `${entry.quantityUsed} kg`
        }));
      },
      error: (err) => console.error('Error cargando movimientos:', err)
    });
  }
}
