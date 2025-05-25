import { Routes } from '@angular/router';
import {ViewConsultationsComponent} from './consultations/components/view-consultations/view-consultations.component';
import {ViewFileComponent} from './consultations/pages/view-file/view-file.component';
import {ViewNewDefectComponent} from './consultations/pages/view-new-defect/view-new-defect.component';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";

export const routes: Routes = [
  { path: '',                 redirectTo: 'libraryDefects', pathMatch: 'full' },

  { path: 'libraryDefects',             component: ViewConsultationsComponent },
  { path: 'file/:id', component: ViewFileComponent },
  { path: 'new-defect', component: ViewNewDefectComponent },

  { path: '**',               component: PageNotFoundComponent }
];
