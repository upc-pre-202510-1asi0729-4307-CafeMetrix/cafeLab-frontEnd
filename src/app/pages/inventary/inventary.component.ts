import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

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
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
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
  recentMovements: any[] = [];  // This would be populated with actual data
}
