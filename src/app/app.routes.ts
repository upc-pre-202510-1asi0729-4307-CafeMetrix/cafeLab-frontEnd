import { Routes } from '@angular/router';
import { InventaryComponent } from './pages/inventary/inventary.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inventary', pathMatch: 'full' },
  { path: 'inventary', component: InventaryComponent }
];
