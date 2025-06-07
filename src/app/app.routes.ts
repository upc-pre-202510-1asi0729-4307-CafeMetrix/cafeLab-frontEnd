import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { RecipeListComponent } from './preparation/pages/recipe-list/recipe-list.component';
import { CreateRecipeComponent } from './preparation/pages/create-recipe/create-recipe.component';
import { PortfolioDetailComponent } from './preparation/pages/portfolio-detail/portfolio-detail.component';
import { RecipeDetailComponent } from './preparation/pages/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/preparation/recipes', pathMatch: 'full' },
  {
    path: 'preparation',
    children: [
      { path: 'recipes', component: RecipeListComponent },
      { path: 'recipes/create', component: CreateRecipeComponent },
      { path: 'recipes/:id', component: RecipeDetailComponent },
      { path: 'portfolios/:id', component: PortfolioDetailComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];
