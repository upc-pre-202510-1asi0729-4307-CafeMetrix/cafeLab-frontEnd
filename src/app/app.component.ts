import { Component } from '@angular/core';
import {ViewCalibrationsComponent} from './calibrations/components/view-calibration/view-calibration.component';
import {AddNewCalibrationComponent} from './calibrations/components/add-new-calibration/add-new-calibration.component';

@Component({
  selector: 'app-root',
  imports: [ViewCalibrationsComponent, AddNewCalibrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'calibration';
}
