import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent) },
  { path: 'proveedores', loadComponent: () => import('./supply/components/provider-list/provider-list.component').then(m => m.ProviderListComponent) },
  { path: 'lotes-cafe', loadComponent: () => import('./coffee-lot/components/lot-list/lot-list.component').then(m => m.LotListComponent) },
  { path: 'perfiles-tueste', loadComponent: () => import('./roasting/components/roast-profile-list/roast-profile-list.component').then(m => m.RoastProfileListComponent) }
];
