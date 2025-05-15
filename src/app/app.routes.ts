import { Routes } from '@angular/router';
import { RecipeListComponent } from './preparation/pages/recipe-list/recipe-list.component';
import { PortfolioDetailComponent } from './preparation/pages/portfolio-detail/portfolio-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    component: RecipeListComponent
  },
  {
    path: 'portfolio/:id',
    component: PortfolioDetailComponent
  },
  {
    path: 'recipes/create',
    loadComponent: () => import('./preparation/pages/create-recipe/create-recipe.component')
      .then(m => m.CreateRecipeComponent)
  },
  {
    path: 'dashboard',
    redirectTo: '/recipes',
    pathMatch: 'full'
  }
];
