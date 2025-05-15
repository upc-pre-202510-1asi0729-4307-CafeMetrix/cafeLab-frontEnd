import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { PortfolioService } from '../../services/portfolio.service';
import { RecipeService } from '../../services/recipe.service';
import { Portfolio } from '../../../shared/domain/models/portfolio.model';
import { Drink } from '../../../shared/domain/models/drink.model';
import { CreatePortfolioDialogComponent } from '../../components/create-portfolio-dialog/create-portfolio-dialog.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  portfolios: Portfolio[] = [];
  drinks: Drink[] = [];
  filteredDrinks: Drink[] = [];
  searchTerm: string = '';

  constructor(
    private portfolioService: PortfolioService,
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
    this.loadDrinks();
  }

  loadPortfolios() {
    this.portfolioService.getAll().subscribe(portfolios => {
      this.portfolios = portfolios;
    });
  }

  loadDrinks() {
    this.recipeService.getAll().subscribe(drinks => {
      this.drinks = drinks.filter(d => !d.portfolioId);
      this.filteredDrinks = [...this.drinks];
    });
  }

  filterDrinks() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredDrinks = [...this.drinks];
      return;
    }
    this.filteredDrinks = this.drinks.filter(drink =>
      drink.name.toLowerCase().includes(term)
    );
  }

  openCreatePortfolioDialog() {
    const dialogRef = this.dialog.open(CreatePortfolioDialogComponent, {
      width: '400px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        this.portfolioService.create({ name: result.name, id: 0, createdAt: new Date().toISOString() }).subscribe(() => {
          this.loadPortfolios();
        });
      }
    });
  }

  navigateToPortfolio(portfolioId: number) {
    this.router.navigate(['/portfolio', portfolioId]);
  }

  navigateToCreateRecipe() {
    this.router.navigate(['/recipes/create']).then(
      (success) => {
        if (!success) {
          console.error('Error en la navegación a crear receta');
        }
      }
    );
  }
}
