import { Routes } from '@angular/router';
import { SelectPaymentComponent } from './pages/select-payment/select-payment.component';
import { WelcomeBaristaComponent } from './pages/welcome-barista/welcome-barista.component';
import { SesionesCataComponent } from './pages/sesiones-cata/sesiones-cata.component';

export const routes: Routes = [
  {
    path: 'welcome-barista',
    component: WelcomeBaristaComponent
  },
  {
    path: 'select-payment',
    component: SelectPaymentComponent
  },
  {
    path: 'sesiones-cata',
    component: SesionesCataComponent
  },
  {
    path: 'libreria-defectos',
    redirectTo: 'welcome-barista',
    pathMatch: 'full'
  },
  {
    path: 'correlacion-tueste-sabor',
    redirectTo: 'welcome-barista',
    pathMatch: 'full'
  },
  {
    path: 'calibracion-molienda',
    redirectTo: 'welcome-barista',
    pathMatch: 'full'
  },
  {
    path: 'recetas',
    redirectTo: 'welcome-barista',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'welcome-barista',
    pathMatch: 'full'
  }
];
