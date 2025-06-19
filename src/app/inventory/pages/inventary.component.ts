import { Component, OnInit } from '@angular/core';
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
import { CoffeeLot } from '../../cost-management/model/coffee-lot.model';
import { InventoryEntry } from '../model/inventory-entry.entity';

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
    RouterLink
  ],
  templateUrl: './inventary.component.html',
  styleUrl: './inventary.component.css'
})
export class InventaryComponent implements OnInit {
  coffeeStocks: (CoffeeLot & { stockStatus: string })[] = [];
  displayedColumns: string[] = ['fecha', 'producto', 'lote', 'cantidad', 'acciones'];
  recentMovements: {
    fecha: string;
    producto: string;
    lote: string;
    cantidad: number;
  }[] = [];

  constructor(
    private dialog: MatDialog,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadCoffeeLots();
    this.loadInventoryEntries();
  }

  loadCoffeeLots(): void {
    this.inventoryService.getCoffeeLots().subscribe((lots) => {
      if (!lots || lots.length === 0) {
        this.coffeeStocks = [
          {
            id: '1',
            name: 'Café Verde',
            origin: 'Perú',
            variety: 'Típica',
            quantityKg: 10,
            stockStatus: 'stock bajo'
          },
          {
            id: '2',
            name: 'Café Tostado',
            origin: 'Colombia',
            variety: 'Caturra',
            quantityKg: 25,
            stockStatus: 'stock adecuado'
          }
        ];
      } else {
        this.coffeeStocks = lots.map(lot => ({
          ...lot,
          stockStatus: lot.quantityKg < 15 ? 'stock bajo' : 'stock adecuado'
        }));
      }
    });
  }

  loadInventoryEntries(): void {
    this.inventoryService.getInventoryEntries().subscribe(entries => {
      this.recentMovements = entries.map(entry => ({
        fecha: entry.dateUsed, // ISO format
        producto: 'Café',
        lote: String(entry.coffeeLotId),
        cantidad: entry.quantityUsed
      }));
    });
  }

  openRegisterConsumptionDialog(lotId: string): void {
    const dialogRef = this.dialog.open(RegisterConsumptionDialogComponent, {
      width: '80%',
      maxWidth: '1200px',
      panelClass: 'register-consumption-dialog',
      data: { coffeeLotId: lotId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inventoryService.addInventoryEntry(result).subscribe((entry) => {
          this.recentMovements.push({
            fecha: entry.dateUsed,
            producto: 'Café',
            lote: String(entry.coffeeLotId),
            cantidad: entry.quantityUsed
          });
        });
      }
    });
  }
}
