import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { LoginSuccessPageComponent } from './auth/pages/login-success-page/login-success-page.component';
import { LogupBaristaPageComponent } from './auth/pages/logup-barista-page/logup-barista-page.component';
import { LogupBaristaSuccessPageComponent } from './auth/pages/logup-barista-success-page/logup-barista-success-page.component';
import { LogupOwnerPageComponent } from './auth/pages/logup-owner-page/logup-owner-page.component';
import { LogupOwnerSuccessPageComponent } from './auth/pages/logup-owner-success-page/logup-owner-success-page.component';
import { EditProfilePageComponent } from './auth/pages/edit-profile-page/edit-profile-page.component';
import { SelectPlanComponent } from './subscription/components/select-plan/select-plan.component';
import { BaristaDashboardComponent } from './dashboard/components/barista-dashboard/barista-dashboard.component'
import { OwnerDashboardComponent } from './dashboard/components/owner-dashboard/owner-dashboard.component';
import { CompleteDashboardComponent } from './dashboard/components/complete-dashboard/complete-dashboard.component';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { ConfirmPlanComponent } from './subscription/components/confirm-plan/confirm-plan.component';
import {RoastingPageComponent} from './roasting/pages/roasting-page/roasting-page.component';
import {RoastProfileComparisonComponent} from './roasting/components/roast-profile-comparison/roast-profile-comparison.component';
import {LotsComponent} from './coffee-lot/pages/lots-page/lots.component';
import {SupplyPageComponent} from './supply/pages/supply-page/supply-page.component';
import {ViewConsultationsComponent} from './consultations/components/view-consultations/view-consultations.component';
import {SesionesCataComponent} from './cupping-sessions/pages/sesiones-cata/sesiones-cata.component';
import {InventaryComponent} from './inventory/pages/inventary.component';
import {
  ProductionCostPageComponent
} from './cost-management/pages/production-cost-management/production-cost-management.component';
import {ViewNewDefectComponent} from './consultations/pages/view-new-defect/view-new-defect.component';
import {ViewFileComponent} from './consultations/pages/view-file/view-file.component';

import { RecipeListComponent } from './preparation/pages/recipe-list/recipe-list.component';
import { CreateRecipeComponent } from './preparation/pages/create-recipe/create-recipe.component';
import { PortfolioDetailComponent } from './preparation/pages/portfolio-detail/portfolio-detail.component';
import { RecipeDetailComponent } from './preparation/pages/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'login/success', component: LoginSuccessPageComponent },
  { path: 'register/barista', component: LogupBaristaPageComponent },
  { path: 'logup/barista/success', component: LogupBaristaSuccessPageComponent },
  { path: 'register/owner', component: LogupOwnerPageComponent },
  { path: 'logup/owner/success', component: LogupOwnerSuccessPageComponent },
  { path: 'edit-profile', component: EditProfilePageComponent },
  { path: 'subscription/select-plan', component: SelectPlanComponent },
  { path: 'subscription/confirm-plan', component: ConfirmPlanComponent },
  { path: 'confirm-plan/select-plan', component: SelectPlanComponent },
  { path: 'select-plan', component: SelectPlanComponent  },
  // esto se modifica acá y en edit-profile-form.component.ts se cambia el nombre de ruteos si fuese necesario
  { path: 'dashboard/barista', component: BaristaDashboardComponent },
  { path: 'libraryDefects',             component: ViewConsultationsComponent },
  {path: 'cupping-sessions', component: SesionesCataComponent},
  { path: 'new-defect', component: ViewNewDefectComponent },
  { path: 'file/:id', component: ViewFileComponent },
  {
    path: 'preparation',
    children: [
      { path: 'recipes', component: RecipeListComponent },
      { path: 'recipes/create', component: CreateRecipeComponent },
      { path: 'recipes/:id', component: RecipeDetailComponent },
      { path: 'portfolios/:id', component: PortfolioDetailComponent }
    ]
  },

  { path: 'dashboard/owner', component: OwnerDashboardComponent},
  {path: 'inventory', component: InventaryComponent},
  { path: 'production-cost-management', component: ProductionCostPageComponent },
  { path: 'dashboard/complete', component: CompleteDashboardComponent},
  { path: 'contacto', loadComponent: () => import('./public/components/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },

  { path:'suppliers', component: SupplyPageComponent },
  { path:'coffee-lots', component: LotsComponent },
  { path:'profiles-roasting', component: RoastingPageComponent},
  { path:'compare-profile', component: RoastProfileComparisonComponent  },
  { path: '**', component: PageNotFoundComponent }
];
