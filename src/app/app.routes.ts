import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { LoginSuccessPageComponent } from './auth/pages/login-success-page/login-success-page.component';
import { LogupBaristaPageComponent } from './auth/pages/logup-barista-page/logup-barista-page.component';
import { LogupBaristaSuccessPageComponent } from './auth/pages/logup-barista-success-page/logup-barista-success-page.component';
import { LogupOwnerPageComponent } from './auth/pages/logup-owner-page/logup-owner-page.component';
import { LogupOwnerSuccessPageComponent } from './auth/pages/logup-owner-success-page/logup-owner-success-page.component';
import { EditProfilePageComponent } from './auth/pages/edit-profile-page/edit-profile-page.component';
import { SelectPlanComponent } from './subscription/components/select-plan/select-plan.component';
import { BaristaDashboardComponent } from './dashboard/components/barista-dashboard/barista-dashboard.component';
import { OwnerDashboardComponent } from './dashboard/components/owner-dashboard/owner-dashboard.component';
import { CompleteDashboardComponent } from './dashboard/components/complete-dashboard/complete-dashboard.component';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { ConfirmPlanComponent } from './subscription/components/confirm-plan/confirm-plan.component';
import { SupplierListComponent} from './supply/components/provider-list/supplier-list.component';
import { LotListComponent } from './coffee-lot/components/lot-list/lot-list.component';
import {RoastProfileListComponent} from './roasting/components/roast-profile-list/roast-profile-list.component';
import {RoastProfileComparisonComponent} from './roasting/components/roast-profile-comparison/roast-profile-comparison.component';

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
  { path: 'dashboard/owner', component: OwnerDashboardComponent},
  { path: 'dashboard/complete', component: CompleteDashboardComponent},
  { path: 'contacto', loadComponent: () => import('./public/components/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  // Rutas de Kalet comentadas para evitar el acceso
  // { path: 'libraryDefects', component: ViewConsultationsComponent },
  // { path: 'file/:id', component: ViewFileComponent },
  // { path: 'new-defect', component: ViewNewDefectComponent },
  { path:'suppliers', component: SupplierListComponent },
  { path:'coffee-lots', component: LotListComponent },
  { path:'perfiles-tueste', component: RoastProfileListComponent},
  { path:'compare-profile', component: RoastProfileComparisonComponent  },
  { path: '**', component: PageNotFoundComponent }
];
