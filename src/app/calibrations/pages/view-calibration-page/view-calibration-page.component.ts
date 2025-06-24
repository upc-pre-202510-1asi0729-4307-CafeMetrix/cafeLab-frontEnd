import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {ToolbarComponent} from "../../../public/components/toolbar/toolbar.component";
import {ViewCalibrationComponent} from '../../components/view-calibration/view-calibration.component';

@Component({
  selector: 'app-view-calibration-page',
  imports: [
    MatToolbar,
    ToolbarComponent,
    ViewCalibrationComponent
  ],
  templateUrl: './view-calibration-page.component.html',
  styleUrl: './view-calibration-page.component.css'
})
export class ViewCalibrationPageComponent {

}
