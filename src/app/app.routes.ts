import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";


export const routes: Routes = [
  { path: '', redirectTo: '/select-plan', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent) },
  { path: 'proveedores', loadComponent: () => import('./supply/components/provider-list/supplier-list.component').then(m => m.SupplierListComponent) },
  { path: 'lotes-cafe', loadComponent: () => import('./coffee-lot/components/lot-list/lot-list.component').then(m => m.LotListComponent) },
  { path: 'perfiles-tueste', loadComponent: () => import('./roasting/components/roast-profile-list/roast-profile-list.component').then(m => m.RoastProfileListComponent) },
  { path: 'compare-profile', loadComponent: () => import('./roasting/components/roast-profile-comparison/roast-profile-comparison.component').then(m => m.RoastProfileComparisonComponent) },
  // Ruta para contacto (debe ir ANTES del wildcard **)
  {
    path: 'contacto',
    loadComponent: () => import('./public/components/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  // Wildcard route SIEMPRE debe ir al final
  {
    path: 'select-plan',
    loadComponent: () => import('./user-management/components/select-plan/select-plan.component').then(m => m.SelectPlanComponent)
  },
  {
    path: 'confirm-plan',
    loadComponent: () => import('./user-management/components/confirm-plan/confirm-plan.component').then(m => m.ConfirmPlanComponent)
  },
  {
    path: 'dashboard-owner',
    loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent)
  },

  // Contacto y ruta wildcard
  {
    path: 'contacto',
    loadComponent: () => import('./public/components/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  { path: '**', component: PageNotFoundComponent },

];
