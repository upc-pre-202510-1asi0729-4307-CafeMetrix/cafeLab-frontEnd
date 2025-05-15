import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Drink } from '../../../shared/domain/models/drink.model';

@Component({
  selector: 'app-add-recipe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './add-recipe-dialog.component.html',
  styleUrls: ['./add-recipe-dialog.component.css']
})
export class AddRecipeDialogComponent implements OnInit {
  availableRecipes: Drink[] = [];
  selectedRecipes: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { portfolioId: number },
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loadAvailableRecipes();
  }

  loadAvailableRecipes(): void {
    this.recipeService.getAll().subscribe(recipes => {
      this.availableRecipes = recipes.filter(recipe => !recipe.portfolioId);
    });
  }

  toggleRecipeSelection(recipeId: number): void {
    const index = this.selectedRecipes.indexOf(recipeId);
    if (index === -1) {
      this.selectedRecipes.push(recipeId);
    } else {
      this.selectedRecipes.splice(index, 1);
    }
  }

  isRecipeSelected(recipeId: number): boolean {
    return this.selectedRecipes.includes(recipeId);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddRecipes(): void {
    this.dialogRef.close(this.selectedRecipes);
  }
}
