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
import { RouterModule, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { PortfolioService } from '../../services/portfolio.service';
import { CoffeeDataService, CoffeeLot, RoastProfile } from '../../services/coffee-data.service';
import { Portfolio } from '../../models/portfolio.entity';
import { Drink, Ingredient } from '../../models/drink.entity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

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
  extractionMethod: 'coffee' | 'espresso' = 'coffee';
  portfolios: Portfolio[] = [];
  coffeeLots: CoffeeLot[] = [];
  roastProfiles: RoastProfile[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  // Nuevas propiedades para los métodos de extracción
  extractionMethods = [
    { value: 'pour-over', label: 'Pour Over' },
    { value: 'french-press', label: 'French Press' },
    { value: 'cold-brew', label: 'Cold Brew' },
    { value: 'aeropress', label: 'AeroPress' },
    { value: 'chemex', label: 'Chemex' },
    { value: 'v60', label: 'V60' },
    { value: 'clever', label: 'Clever Dripper' }
  ];

  // Unidades disponibles
  availableUnits = [
    { value: 'gr', label: 'Gramos (gr)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'oz', label: 'Onzas (oz)' },
    { value: 'cups', label: 'Tazas' },
    { value: 'tbsp', label: 'Cucharadas' },
    { value: 'tsp', label: 'Cucharaditas' }
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private portfolioService: PortfolioService,
    private coffeeDataService: CoffeeDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.recipeForm = this.createForm();
    this.changeExtractionMethod('coffee'); // Inicializar con ingredientes por defecto
  }

  ngOnInit(): void {
    this.loadPortfolios();
    this.loadCoffeeLots();
    this.loadRoastProfiles();
  }

  loadPortfolios(): void {
    this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (err) => {
        console.error('Error al cargar portafolios', err);
        this.snackBar.open(
          this.translate.instant('recipes.creation.error_loading_portfolios'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
      }
    });
  }

  loadCoffeeLots(): void {
    this.coffeeDataService.getCoffeeLots().subscribe({
      next: (data) => {
        this.coffeeLots = data;
      },
      error: (err) => {
        console.error('Error al cargar lotes de café', err);
        this.snackBar.open(
          this.translate.instant('recipes.creation.error_loading_lots'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
      }
    });
  }

  loadRoastProfiles(): void {
    this.coffeeDataService.getRoastProfiles().subscribe({
      next: (data) => {
        this.roastProfiles = data;
      },
      error: (err) => {
        console.error('Error al cargar perfiles de tueste', err);
        this.snackBar.open(
          this.translate.instant('recipes.creation.error_loading_roast_profiles'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      image: ['', [Validators.required]], // URL de la imagen
      cata: [''],
      portfolioId: [null],
      molienda: [''],
      ratio: [''],
      tiempo: [''],
      pasos: [''],
      consejos: [''],
      extractionType: ['pour-over'],
      ingredientes: this.fb.array([])
    });
  }

  get ingredientes() {
    return this.recipeForm.get('ingredientes') as FormArray;
  }

  createIngredientFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      unit: ['gr', Validators.required]
    });
  }

  changeExtractionMethod(method: 'coffee' | 'espresso'): void {
    this.extractionMethod = method;
    
    // Limpiar ingredientes existentes
    while (this.ingredientes.length) {
      this.ingredientes.removeAt(0);
    }

    if (method === 'coffee') {
      // Para extracción de café, siempre tendremos agua y café como ingredientes
      this.ingredientes.push(this.fb.group({
        name: ['Agua', Validators.required],
        amount: ['', Validators.required],
        unit: ['ml', Validators.required]
      }));
      this.ingredientes.push(this.fb.group({
        name: ['Café', Validators.required],
        amount: ['', Validators.required],
        unit: ['gr', Validators.required]
      }));
    } else if (method === 'espresso' && this.ingredientes.length === 0) {
      // Para espresso, añadimos un ingrediente inicial vacío
      this.addIngredient();
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addIngredient(): void {
    this.ingredientes.push(this.createIngredientFormGroup());
  }

  removeIngredient(index: number): void {
    this.ingredientes.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      Object.keys(this.recipeForm.controls).forEach(key => {
        const control = this.recipeForm.get(key);
        control?.markAsTouched();
      });

      this.snackBar.open(
        this.translate.instant('recipes.creation.name_required'),
        this.translate.instant('Cerrar'),
        { duration: 3000 }
      );
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const formData = this.recipeForm.value;

    const recipeData: Partial<Drink> = {
      name: formData.name,
      image: formData.image,
      extractionMethod: this.extractionMethod === 'coffee' ? formData.extractionType : 'espresso',
      cata: formData.cata || '',
      portfolioId: formData.portfolioId ? Number(formData.portfolioId) : null,
      molienda: formData.molienda || '',
      ratio: formData.ratio || '',
      preparationTime: formData.tiempo || '',
      steps: formData.pasos || '',
      tips: formData.consejos || '',
      ingredients: formData.ingredientes.map((ing: any) => ({
        name: ing.name,
        amount: ing.amount.toString(),
        unit: ing.unit
      })),
      createdAt: new Date().toISOString()
    };

    this.recipeService.create(recipeData as Drink).subscribe({
      next: (response) => {
        this.snackBar.open(
          this.translate.instant('recipes.creation.success'),
          this.translate.instant('Cerrar'),
          { duration: 3000 }
        );
        this.isSubmitting = false;
        this.router.navigate(['/preparation/recipes']);
      },
      error: (err) => {
        console.error('Error al crear la receta:', err);
        this.isSubmitting = false;
        this.snackBar.open(
          this.translate.instant('recipes.creation.error'),
          this.translate.instant('Cerrar'),
          { duration: 5000 }
        );
      }
    });
  }
}
