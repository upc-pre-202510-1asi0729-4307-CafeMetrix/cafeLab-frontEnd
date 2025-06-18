import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../../services/coffe.service';
import { DefectService } from '../../services/defect.service';
import { Coffee } from '../../model/coffe.entity';
import { Defect } from '../../model/defect.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatPrefix} from '@angular/material/input';
import { Router } from '@angular/router';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-view-consultations',
  templateUrl: './view-consultations.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    MatFormField,
    MatFormField,
    MatFormField,
    MatIconButton,
    MatFormField,
    MatInput,
    MatPrefix,
    MatFormField,
    MatButton,
    NgIf,
    FormsModule,
    MatIconModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    ToolbarComponent,
    MatToolbar
  ],
  styleUrls: ['./view-consultations.component.css']
})
export class ViewConsultationsComponent implements OnInit {
  coffeeSearch: string = '';
  defectSearch: string = '';
  history: any[] = [];
  filteredHistory: any[] = [];


  coffees: Coffee[] = [];
  defects: Defect[] = [];
  displayedColumns: string[] = ['peso', 'cafe', 'defecto', 'porcentaje', 'acciones'];

  constructor(
    private coffeeService: CoffeeService,
    private defectService: DefectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }
  loadData(): void {
    this.coffeeService.getCoffees().subscribe({
      next: (coffees: Coffee[]) => {
        this.coffees = coffees;
        this.defectService.getDefects().subscribe({
          next: (defects: Defect[]) => {
            this.defects = defects;


            this.history = this.defects.map(defect => {
              const coffee = this.coffees.find(c => String(c.id) === String(defect.coffeeId));
              return {
                ...defect,
                coffeeName: coffee ? coffee.name : ''
              };
            });
            this.filteredHistory = [...this.history];
          },
          error: (err) => console.error('Error al cargar defectos:', err)
        });
      },
      error: (err) => console.error('Error al cargar cafés:', err)
    });
  }

  filterData() {
    this.filteredHistory = this.history.filter(row =>
      (!this.coffeeSearch || row.coffeeName.toLowerCase().includes(this.coffeeSearch.toLowerCase())) &&
      (!this.defectSearch || row.name.toLowerCase().includes(this.defectSearch.toLowerCase()))
    );
  }

  clearCoffeeSearch() {
    this.coffeeSearch = '';
    this.filterData();
  }

  clearDefectSearch() {
    this.defectSearch = '';
    this.filterData();
  }
  goToFile(defectId: number) {
    this.router.navigate(['/file', defectId]);
  }
  goToNewDefect() {
    this.router.navigate(['/new-defect']);
  }

}
