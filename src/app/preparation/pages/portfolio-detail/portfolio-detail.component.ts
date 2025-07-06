import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PortfolioService } from '../../services/portfolio.service';
import { RecipeService } from '../../services/recipe.service';
import { Portfolio } from '../../models/portfolio.entity';
import { Drink } from '../../models/drink.entity';
import { AddRecipeDialogComponent } from '../../components/add-recipe-dialog/add-recipe-dialog.component';
import { CreatePortfolioDialogComponent } from '../../components/create-portfolio-dialog/create-portfolio-dialog.component';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    TranslateModule,
    MatToolbar,
    ToolbarComponent
  ],
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css']
})
export class PortfolioDetailComponent implements OnInit {
  portfolio: Portfolio | null = null;
  portfolioRecipes: Drink[] = [];
  portfolioId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService,
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.portfolioId = +params['id'];
        this.loadPortfolio();
        this.loadPortfolioRecipes();
      }
    });
  }

  loadPortfolio(): void {
    this.portfolioService.getById(this.portfolioId).subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
      },
      error: (error) => {
        console.error('Error loading portfolio:', error);
        this.snackBar.open(
          this.translate.instant('portfolio.messages.error_loading'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
        this.router.navigate(['/preparation/recipes']);
      }
    });
  }

  loadPortfolioRecipes(): void {
    this.recipeService.getAll().subscribe({
      next: (recipes) => {
        this.portfolioRecipes = recipes.filter(recipe => recipe.portfolioId === this.portfolioId);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.snackBar.open(
          this.translate.instant('recipes.messages.error_loading'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
      }
    });
  }

  openAddRecipesDialog(): void {
    const dialogRef = this.dialog.open(AddRecipeDialogComponent, {
      width: '500px',
      data: { portfolioId: this.portfolioId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.addRecipesToPortfolio(result);
      }
    });
  }

  addRecipesToPortfolio(recipeIds: number[]): void {
    const updatePromises = recipeIds.map(recipeId => {
      return this.recipeService.getById(recipeId).pipe(
        // Update the recipe with the portfolio ID and return an observable
        switchMap(recipe => {
          recipe.portfolioId = this.portfolioId;
          return this.recipeService.update(recipeId, recipe);
        })
      );
    });

    // Execute all update requests
    forkJoin(updatePromises).subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant('recipes.messages.added'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
        this.loadPortfolioRecipes();
      },
      error: (error) => {
        console.error('Error adding recipes to portfolio:', error);
        this.snackBar.open(
          this.translate.instant('recipes.messages.error_adding'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
      }
    });
  }

  removeRecipeFromPortfolio(recipeId: number): void {
    this.recipeService.getById(recipeId).subscribe({
      next: (recipe) => {
        recipe.portfolioId = null;
        this.recipeService.update(recipeId, recipe).subscribe({
          next: () => {
            this.snackBar.open(
              this.translate.instant('recipes.messages.removed'),
              this.translate.instant('portfolio.actions.cancel'),
              { duration: 3000 }
            );
            this.portfolioRecipes = this.portfolioRecipes.filter(r => r.id !== recipeId);
          },
          error: (error) => {
            console.error('Error removing recipe from portfolio:', error);
            this.snackBar.open(
              this.translate.instant('recipes.messages.error_removing'),
              this.translate.instant('portfolio.actions.cancel'),
              { duration: 3000 }
            );
          }
        });
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.snackBar.open(
          this.translate.instant('recipes.messages.error_loading'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
      }
    });
  }

  openEditDialog(): void {
    if (!this.portfolio) return;

    const dialogRef = this.dialog.open(CreatePortfolioDialogComponent, {
      width: '400px',
      data: { name: this.portfolio.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.name !== this.portfolio?.name) {
        this.updatePortfolioName(result.name);
      }
    });
  }

  updatePortfolioName(newName: string): void {
    if (!this.portfolio) return;

    const updatedPortfolio = { ...this.portfolio, name: newName };
    this.portfolioService.update(this.portfolioId, updatedPortfolio).subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
        this.snackBar.open(
          this.translate.instant('portfolio.messages.updated'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
      },
      error: (error) => {
        console.error('Error updating portfolio:', error);
        this.snackBar.open(
          this.translate.instant('portfolio.messages.error_updating'),
          this.translate.instant('portfolio.actions.cancel'),
          { duration: 3000 }
        );
      }
    });
  }

  deletePortfolio(): void {
    if (confirm(this.translate.instant('portfolio.delete_confirmation'))) {
      // First, remove portfolio association from all recipes
      this.recipeService.getAll().subscribe({
        next: (recipes) => {
          const portfolioRecipes = recipes.filter(recipe => recipe.portfolioId === this.portfolioId);

          if (portfolioRecipes.length > 0) {
            const updatePromises = portfolioRecipes.map(recipe => {
              recipe.portfolioId = null;
              return this.recipeService.update(recipe.id, recipe);
            });

            forkJoin(updatePromises).subscribe({
              next: () => {
                this.deletePortfolioAfterRemovingRecipes();
              },
              error: (error) => {
                console.error('Error removing recipe associations:', error);
                this.snackBar.open(
                  this.translate.instant('recipes.messages.error_removing'),
                  this.translate.instant('portfolio.actions.cancel'),
                  { duration: 3000 }
                );
              }
            });
          } else {
            this.deletePortfolioAfterRemovingRecipes();
          }
        },
        error: (error) => {
          console.error('Error loading recipes:', error);
          this.snackBar.open(
            this.translate.instant('recipes.messages.error_loading'),
            this.translate.instant('portfolio.actions.cancel'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  private deletePortfolioAfterRemovingRecipes(): void {
    this.portfolioService.delete(this.portfolioId).subscribe({
      next: () => {
        this.snackBar.open('Portafolio eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/preparation/recipes']);
      },
      error: (error) => {
        console.error('Error deleting portfolio:', error);
        this.snackBar.open('Error al eliminar el portafolio', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
