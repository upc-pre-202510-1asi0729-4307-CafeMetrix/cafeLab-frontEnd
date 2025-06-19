import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecipeService } from '../../services/recipe.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Drink } from '../../models/drink.entity';
import { Portfolio } from '../../models/portfolio.entity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule,
    TranslateModule,
    MatSnackBarModule,
    MatToolbar,
    ToolbarComponent
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Drink | null = null;
  portfolio: Portfolio | null = null;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (!recipeId) {
      this.router.navigate(['/preparation/recipes']);
      return;
    }

    this.loadRecipe(parseInt(recipeId, 10));
  }

  private loadRecipe(id: number): void {
    this.recipeService.getById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        if (recipe.portfolioId) {
          this.loadPortfolio(recipe.portfolioId);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar la receta:', err);
        this.error = true;
        this.isLoading = false;
        this.snackBar.open(
          'Error al cargar la receta',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  private loadPortfolio(portfolioId: number): void {
    this.portfolioService.getById(portfolioId).subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el portafolio:', err);
        this.isLoading = false;
      }
    });
  }

  getNavigationPath(): string {
    return this.portfolio
      ? `/preparation/portfolios/${this.portfolio.id}`
      : '/preparation/recipes';
  }

  getNavigationText(): string {
    return this.portfolio
      ? this.portfolio.name
      : 'NAVIGATION.DRINKS';
  }
}
