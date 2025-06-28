import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { InventoryEntry } from '../../model/inventory-entry.entity';
import { CoffeeLot } from '../../../coffee-lot/model/coffee-lot.model';
import { ConsumptionDetailDialogComponent } from '../consumption-detail-dialog/consumption-detail-dialog.component';

interface ConsumptionTableItem {
  id: number;
  date: string;
  lotName: string;
  consumptionKg: number;
  lotId: number;
  finalProduct?: string;
  coffeeType?: string;
  status?: string;
}

@Component({
  selector: 'app-consumption-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslatePipe
  ],
  templateUrl: './consumption-table.component.html',
  styleUrls: ['./consumption-table.component.css']
})
export class ConsumptionTableComponent {
  @Input() consumptionEntries: InventoryEntry[] = [];
  @Input() lots: CoffeeLot[] = [];
  
  tableData: ConsumptionTableItem[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(): void {
    this.updateTableData();
  }

  updateTableData(): void {
    this.tableData = this.consumptionEntries.map(entry => {
      const lot = this.lots.find(l => l.id === entry.coffeeLotId.toString());
      return {
        id: entry.id,
        date: new Date(entry.dateUsed).toLocaleDateString(),
        lotName: lot ? lot.lot_name : `Lote ${entry.coffeeLotId}`,
        consumptionKg: entry.quantityUsed,
        lotId: entry.coffeeLotId,
        finalProduct: entry.finalProduct || 'N/A',
        coffeeType: lot ? lot.coffee_type : 'N/A',
        status: lot ? lot.status : 'N/A'
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  viewConsumptionDetail(item: ConsumptionTableItem): void {
    const dialogRef = this.dialog.open(ConsumptionDetailDialogComponent, {
      width: '500px',
      data: item
    });
  }
} 