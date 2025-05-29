// app.routes.ts
import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { LoginSuccessPageComponent } from './auth/pages/login-success-page/login-success-page.component';
import { LogupBaristaPageComponent } from './auth/pages/logup-barista-page/logup-barista-page.component';
import { LogupBaristaSuccessPageComponent } from './auth/pages/logup-barista-success-page/logup-barista-success-page.component';
import { LogupOwnerPageComponent } from './auth/pages/logup-owner-page/logup-owner-page.component';
import { LogupOwnerSuccessPageComponent } from './auth/pages/logup-owner-success-page/logup-owner-success-page.component';
import { EditProfilePageComponent } from './auth/pages/edit-profile-page/edit-profile-page.component';
import { SelectPlanComponent } from './subscription/components/select-plan/select-plan.component';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'login/success', component: LoginSuccessPageComponent },
  { path: 'register/barista', component: LogupBaristaPageComponent },
  { path: 'register/barista/success', component: LogupBaristaSuccessPageComponent },
  { path: 'register/owner', component: LogupOwnerPageComponent },
  { path: 'register/owner/success', component: LogupOwnerSuccessPageComponent },
  { path: 'edit-profile', component: EditProfilePageComponent },
  { path: 'subscription/selectplan', component: SelectPlanComponent },
  // Rutas existentes comentadas para evitar el acceso
  // { path: 'libraryDefects', component: ViewConsultationsComponent },
  // { path: 'file/:id', component: ViewFileComponent },
  // { path: 'new-defect', component: ViewNewDefectComponent },
  { path: '**', component: PageNotFoundComponent }
];
