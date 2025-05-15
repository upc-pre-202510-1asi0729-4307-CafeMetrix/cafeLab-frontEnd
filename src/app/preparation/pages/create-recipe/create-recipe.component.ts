import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../../shared/domain/models/portfolio.model';
import { Drink, Ingredient } from '../../../shared/domain/models/drink.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  extractionMethod: 'coffee' | 'espresso' = 'coffee';
  portfolios: Portfolio[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private portfolioService: PortfolioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (err) => {
        console.error('Error al cargar portafolios', err);
        this.snackBar.open('Error al cargar los portafolios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      lote: [''],
      tueste: [''],
      cata: [''],
      portfolioId: [null],
      molienda: [''],
      ratio: [''],
      tiempo: [''],
      pasos: [''],
      consejos: [''],
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
    if (method === 'espresso' && this.ingredientes.length === 0) {
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
      // Marcar todos los campos como tocados para mostrar errores
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

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formData = this.recipeForm.value;
    
    // Crear objeto para enviar a la API
    const recipeData: Partial<Drink> = {
      id: 0, // El backend debería manejar la asignación del ID
      name: formData.name,
      image: this.imagePreview?.toString() || 'assets/images/default-recipe.jpg',
      extractionMethod: this.extractionMethod,
      lote: formData.lote || '',
      tueste: formData.tueste || '',
      cata: formData.cata || '',
      portfolioId: formData.portfolioId,
      molienda: formData.molienda || '',
      ratio: formData.ratio || '',
      preparationTime: formData.tiempo || '',
      steps: formData.pasos || '',
      tips: formData.consejos || '',
      ingredients: this.extractionMethod === 'espresso' ? formData.ingredientes : [],
      createdAt: new Date().toISOString()
    };

    console.log('Enviando datos de receta:', recipeData);

    this.recipeService.create(recipeData as Drink).subscribe({
      next: (response) => {
        console.log('Receta creada exitosamente:', response);
        this.snackBar.open(
          this.translate.instant('recipes.creation.success'), 
          this.translate.instant('Cerrar'), 
          { duration: 3000 }
        );
        this.isSubmitting = false;
        this.router.navigate(['/recipes']).then(() => {
          console.log('Navegación exitosa');
        }).catch(err => {
          console.error('Error en la navegación:', err);
          // Intentar navegar a la ruta alternativa
          this.router.navigate(['/dashboard']).catch(err => {
            console.error('Error en la navegación alternativa:', err);
          });
        });
      },
      error: (err) => {
        console.error('Error al crear la receta:', err);
        this.isSubmitting = false;
        this.snackBar.open(
          this.translate.instant('recipes.creation.error') + `: ${err.message || 'Error desconocido'}`, 
          this.translate.instant('Cerrar'), 
          { duration: 5000 }
        );
      }
    });
  }
} 