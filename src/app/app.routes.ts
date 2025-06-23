import { Routes } from '@angular/router';
import { ViewCalibrationsComponent } from './calibrations/components/view-calibration/view-calibration.component';
import {NewCalibrationComponent} from './calibrations/pages/new-calibration/new-calibration.component';

export const routes: Routes = [
  { path: 'calibrations', component: ViewCalibrationsComponent },
  { path: 'new-calibration', component: NewCalibrationComponent },
  { path: '', redirectTo: 'calibrations', pathMatch: 'full' },
  { path: '**', redirectTo: 'calibrations' }
];
