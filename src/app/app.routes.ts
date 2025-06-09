import { Routes } from '@angular/router';
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {ViewFileComponent} from './consultations/pages/view-file/view-file.component';
import {ViewNewDefectComponent} from './consultations/pages/view-new-defect/view-new-defect.component';
import {LibraryComponent} from './public/pages/library/library.component';

export const routes: Routes = [
  { path: 'libraryDefects',             component: LibraryComponent },
  { path: 'file/:id', component: ViewFileComponent },
  { path: 'new-defect', component: ViewNewDefectComponent },
  { path: '',                 redirectTo: 'libraryDefects', pathMatch: 'full' },
  { path: '**',               component: PageNotFoundComponent }
];
