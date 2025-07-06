import { AuthGuard } from './auth/services/auth.guard';
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
import {ViewCalibrationPageComponent} from './calibrations/pages/view-calibration-page/view-calibration-page.component';
import {AddCalibrationPageComponent} from './calibrations/pages/add-calibration-page/add-calibration-page.component';
import {EditCalibrationPageComponent} from './calibrations/pages/edit-calibration-page/edit-calibration-page.component';
import {MoreInfoPageComponent} from './calibrations/pages/more-info-page/more-info-page.component';
import { EditProfileSessionPageComponent } from './auth/pages/edit-profile-session-page/edit-profile-session-page.component';
import {ChangePlanComponent} from './subscription/components/change-plan/change-plan.component';
import {ConfirmChangePlanComponent} from './subscription/components/confirm-change-plan/confirm-change-plan.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'login/success', component: LoginSuccessPageComponent, canActivate: [AuthGuard] },
  { path: 'register/barista', component: LogupBaristaPageComponent },
  { path: 'logup/barista/success', component: LogupBaristaSuccessPageComponent},
  { path: 'register/owner', component: LogupOwnerPageComponent },
  { path: 'logup/owner/success', component: LogupOwnerSuccessPageComponent},
  { path: 'edit-profile', component: EditProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'subscription/select-plan', component: SelectPlanComponent, canActivate: [AuthGuard] },
  { path: 'subscription/change-plan', component: ChangePlanComponent, canActivate: [AuthGuard] },
  { path: 'subscription/confirm-change-plan', component: ConfirmChangePlanComponent, canActivate: [AuthGuard] },
  { path: 'subscription/confirm-plan', component: ConfirmPlanComponent, canActivate: [AuthGuard] },
  { path: 'confirm-plan/select-plan', component: SelectPlanComponent, canActivate: [AuthGuard] },
  { path: 'edit-profile-session', component: EditProfileSessionPageComponent, canActivate: [AuthGuard] },
  { path: 'select-plan', component: SelectPlanComponent, canActivate: [AuthGuard]  },
  // esto se modifica acá y en edit-profile-form.component.ts se cambia el nombre de ruteos si fuese necesario
  { path: 'dashboard/barista', component: BaristaDashboardComponent, canActivate: [AuthGuard] },
  { path: 'libraryDefects',             component: ViewConsultationsComponent, canActivate: [AuthGuard] },
  {path: 'cupping-sessions', component: SesionesCataComponent, canActivate: [AuthGuard]},
  { path: 'new-defect', component: ViewNewDefectComponent, canActivate: [AuthGuard] },
  { path: 'file/:id', component: ViewFileComponent, canActivate: [AuthGuard] },
  {
    path: 'preparation',
    children: [
      { path: 'recipes', component: RecipeListComponent, canActivate: [AuthGuard] },
      { path: 'recipes/create', component: CreateRecipeComponent, canActivate: [AuthGuard] },
      { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] },
      { path: 'recipes/edit/:id', component: CreateRecipeComponent, canActivate: [AuthGuard] },
      { path: 'portfolios/:id', component: PortfolioDetailComponent, canActivate: [AuthGuard] }
    ]
  },

  { path: 'dashboard/owner', component: OwnerDashboardComponent, canActivate: [AuthGuard]},
  {path: 'inventory', component: InventaryComponent, canActivate: [AuthGuard]},
  { path: 'production-cost-management', component: ProductionCostPageComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/complete', component: CompleteDashboardComponent, canActivate: [AuthGuard]},
  { path: 'contacto', loadComponent: () => import('./public/components/contact-us/contact-us.component').then(m => m.ContactUsComponent), canActivate: [AuthGuard]
  },
  { path:'grind-calibration', component: ViewCalibrationPageComponent, canActivate: [AuthGuard] },
  { path:'add-new-calibration', component: AddCalibrationPageComponent, canActivate: [AuthGuard] },
  { path:'edit-calibration/:id', component: EditCalibrationPageComponent, canActivate: [AuthGuard] },
  { path:'more-info-calibration/:id', component: MoreInfoPageComponent, canActivate: [AuthGuard] },

  { path:'suppliers', component: SupplyPageComponent, canActivate: [AuthGuard] },
  { path:'coffee-lots', component: LotsComponent, canActivate: [AuthGuard] },
  { path:'profiles-roasting', component: RoastingPageComponent, canActivate: [AuthGuard]},
  { path:'compare-profile', component: RoastProfileComparisonComponent, canActivate: [AuthGuard]  },
  { path: '**', component: PageNotFoundComponent }
];
