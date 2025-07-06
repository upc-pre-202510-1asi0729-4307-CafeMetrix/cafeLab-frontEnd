import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { IngredientService } from '../../services/ingredient.service';
import { PortfolioService } from '../../services/portfolio.service';
import { CuppingSessionService } from '../../../cupping-sessions/services/cupping-session.service';
import { Portfolio } from '../../models/portfolio.entity';
import { Recipe, ExtractionMethod } from '../../models/recipe.entity';
import { Ingredient } from '../../models/ingredient.entity';
import { CuppingSession } from '../../../cupping-sessions/model/cupping-session.entity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    TranslateModule,
    MatToolbar,
    ToolbarComponent
  ],
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  extractionCategory: 'coffee' | 'espresso' = 'coffee';
  extractionMethod: ExtractionMethod = 'pour-over';
  portfolios: Portfolio[] = [];
  cuppingSessions: CuppingSession[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  isEditMode = false;
  recipeId: string | null = null;

  extractionMethods: { value: ExtractionMethod; label: string }[] = [
    { value: 'pour-over',   label: 'Pour Over' },
    { value: 'french-press', label: 'French Press' },
    { value: 'cold-brew',   label: 'Cold Brew' },
    { value: 'aeropress',   label: 'AeroPress' },
    { value: 'chemex',      label: 'Chemex' },
    { value: 'v60',         label: 'V60' },
    { value: 'clever',      label: 'Clever Dripper' }
  ];

  availableUnits = [
    { value: 'gr',    label: 'Gramos (gr)' },
    { value: 'ml',    label: 'Mililitros (ml)' },
    { value: 'oz',    label: 'Onzas (oz)' },
    { value: 'cups',  label: 'Tazas' },
    { value: 'tbsp',  label: 'Cucharadas' },
    { value: 'tsp',   label: 'Cucharaditas' }
  ];

  coffeeRatios = [
    { value: '1:12', label: '1:12 (Concentrado)' },
    { value: '1:14', label: '1:14 (Balanceado)' },
    { value: '1:15', label: '1:15 (Estándar)' },
    { value: '1:16', label: '1:16 (Suave)' },
    { value: '1:17', label: '1:17 (Ligero)' }
  ];

  espressoRatios = [
    { value: '1:1', label: '1:1 (Ristretto)' },
    { value: '1:1.5', label: '1:1.5 (Corto)' },
    { value: '1:2', label: '1:2 (Estándar)' },
    { value: '1:2.5', label: '1:2.5 (Largo)' },
    { value: '1:3', label: '1:3 (Lungo)' }
  ];

  get availableRatios() {
    return this.extractionCategory === 'coffee' ? this.coffeeRatios : this.espressoRatios;
  }

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private portfolioService: PortfolioService,
    private cuppingSessionService: CuppingSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.recipeForm = this.createForm();
    this.changeExtractionCategory('coffee');
  }

  ngOnInit(): void {
    this.loadPortfolios();
    this.loadCuppingSessions();

    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = id;
      this.loadRecipe(id);
    }
  }

  loadRecipe(id: string): void {
    this.recipeService.getById(id).subscribe({
      next: (recipe) => {
        this.extractionCategory = recipe.extractionCategory;
        this.extractionMethod = recipe.extractionMethod;

        // Limpiar los ingredientes existentes
        while (this.ingredients.length) {
          this.ingredients.removeAt(0);
        }

        // Cargar los ingredientes de la receta desde el servicio
        this.ingredientService.getByRecipeId(parseInt(id)).subscribe({
          next: (ingredients) => {
            ingredients.forEach(ingredient => {
              this.ingredients.push(this.fb.group({
                name: [ingredient.name, Validators.required],
                amount: [ingredient.amount, Validators.required],
                unit: [ingredient.unit, Validators.required]
              }));
            });
          },
          error: (err) => {
            console.error('Error al cargar los ingredientes:', err);
          }
        });

        // Actualizar el formulario con los datos de la receta
        this.recipeForm.patchValue({
          name: recipe.name,
          imageUrl: recipe.imageUrl,
          cupping: recipe.cupping,
          cuppingSessionId: recipe.cuppingSessionId,
          portfolioId: recipe.portfolioId,
          grindSize: recipe.grindSize,
          ratio: recipe.ratio,
          preparationTime: recipe.preparationTime,
          steps: recipe.steps,
          tips: recipe.tips,
          extractionCategory: recipe.extractionCategory,
          extractionMethod: recipe.extractionMethod
        });

        // Mostrar la imagen existente
        this.imagePreview = recipe.imageUrl;
      },
      error: (err) => {
        console.error('Error al cargar la receta:', err);
        this.snackBar.open(
          this.translate.instant('recipes.edit.error_loading'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
        this.router.navigate(['/preparation/recipes']);
      }
    });
  }

  loadCuppingSessions(): void {
    this.cuppingSessionService.getAll().subscribe({
      next: (sessions) => {
        this.cuppingSessions = sessions;
      },
      error: (error) => {
        console.error('Error al cargar las sesiones de cata:', error);
        this.snackBar.open(
          this.translate.instant('Error al cargar las sesiones de cata'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      cupping: [''],
      cuppingSessionId: [null],
      portfolioId: [null],
      grindSize: [''],
      ratio: [''],
      preparationTime: [''],
      steps: [''],
      tips: [''],
      extractionCategory: ['coffee', Validators.required],
      extractionMethod: ['pour-over', Validators.required],
      ingredients: this.fb.array([])
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredientFormGroup(): FormGroup {
    return this.fb.group({
      name:   ['', Validators.required],
      amount: ['', Validators.required],
      unit:   ['gr', Validators.required]
    });
  }

  loadPortfolios(): void {
    this.portfolioService.getAll().subscribe({
      next: data => this.portfolios = data,
      error: () => this.snackBar.open(
        this.translate.instant('recipes.creation.error_loading_portfolios'),
        this.translate.instant('Cerrar'),
        { duration: 3000 }
      )
    });
  }

  changeExtractionCategory(category: 'coffee' | 'espresso'): void {
    if (this.isEditMode) return; // No cambiar ingredientes automáticamente en modo edición

    this.extractionCategory = category;
    this.recipeForm.patchValue({
      extractionCategory: category,
      ratio: null // Resetear el ratio cuando cambia la categoría
    });

    if (category === 'espresso') {
      this.extractionMethod = 'espresso';
      this.recipeForm.patchValue({ extractionMethod: 'espresso' });
    } else {
      this.extractionMethod = 'pour-over';
      this.recipeForm.patchValue({ extractionMethod: 'pour-over' });
    }

    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }

    if (category === 'coffee') {
      this.ingredients.push(this.fb.group({
        name:   ['Agua', Validators.required],
        amount: ['', Validators.required],
        unit:   ['ml', Validators.required]
      }));
      this.ingredients.push(this.fb.group({
        name:   ['Café', Validators.required],
        amount: ['', Validators.required],
        unit:   ['gr', Validators.required]
      }));
    } else {
      this.addIngredient();
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files?.length) return;
    this.selectedFile = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientFormGroup());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const f = this.recipeForm.value;

    // Encontrar el nombre de la sesión de cata seleccionada
    const selectedSession = this.cuppingSessions.find(s => s.id === f.cuppingSessionId);
    
    const recipe: Partial<Recipe> = {
      name: f.name,
      imageUrl: f.imageUrl,
      extractionMethod: f.extractionMethod,
      extractionCategory: f.extractionCategory,
      ratio: f.ratio || '',
      grindSize: f.grindSize || '',
      preparationTime: f.preparationTime || 0,
      steps: f.steps || '',
      tips: f.tips || '',
      portfolioId: f.portfolioId != null ? Number(f.portfolioId) : null,
      cuppingSessionId: f.cuppingSessionId != null ? Number(f.cuppingSessionId) : 0,
      cupping: selectedSession?.nombre || '',
      createdAt: new Date().toISOString()
    };

    const request = this.isEditMode && this.recipeId
      ? this.recipeService.update(this.recipeId, recipe as Recipe)
      : this.recipeService.create(recipe as Recipe);

    request.pipe(
      switchMap((recipe) => {
        // Guardar los ingredientes por separado
        const ingredientsData = f.ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit
        }));

        if (this.isEditMode && this.recipeId) {
          return this.ingredientService.updateRecipeIngredients(recipe.id, ingredientsData)
            .pipe(map(() => recipe));
        } else {
          return this.ingredientService.createMultiple(recipe.id, ingredientsData)
            .pipe(map(() => recipe));
        }
      })
    ).subscribe({
      next: (recipe) => {
        this.snackBar.open(
          this.translate.instant(this.isEditMode ? 'recipes.edit.success' : 'recipes.creation.success'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );

        if (recipe.portfolioId) {
          this.router.navigate(['/preparation/portfolios', recipe.portfolioId]);
        } else {
          this.router.navigate(['/preparation/recipes']);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting = false;
        this.snackBar.open(
          this.translate.instant(this.isEditMode ? 'recipes.edit.error' : 'recipes.creation.error'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
      }
    });
  }
}
