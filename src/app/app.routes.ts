import { Routes } from '@angular/router';
import {ViewConsultationsComponent} from './consultations/components/view-consultations/view-consultations.component';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {ViewFileComponent} from './consultations/pages/view-file/view-file.component';
import {ViewNewDefectComponent} from './consultations/pages/view-new-defect/view-new-defect.component';
import {WelcomeBaristaComponent} from './dashboards/pages/welcome-barista/welcome-barista.component';
import {SesionesCataComponent} from './cupping-sessions/pages/sesiones-cata/sesiones-cata.component';
import {InventaryComponent} from './inventory/pages/inventary.component';

export const routes: Routes = [
  { path: 'libraryDefects',             component: ViewConsultationsComponent },
  { path: 'welcome-barista', component: WelcomeBaristaComponent },
  {path: 'cupping-sessions', component: SesionesCataComponent},
  {path: 'inventory', component: InventaryComponent},
  { path: 'file/:id', component: ViewFileComponent },
  { path: 'new-defect', component: ViewNewDefectComponent },
  { path: '',                 redirectTo: 'libraryDefects', pathMatch: 'full' },
  { path: '**',               component: PageNotFoundComponent }
];
