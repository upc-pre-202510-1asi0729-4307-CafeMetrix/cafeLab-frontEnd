import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {ToolbarComponent} from "../../../public/components/toolbar/toolbar.component";
import {EditCalibrationComponent} from '../../components/edit-calibration/edit-calibration.component';

@Component({
  selector: 'app-edit-calibration-page',
  imports: [
    MatToolbar,
    ToolbarComponent,
    EditCalibrationComponent
  ],
  templateUrl: './edit-calibration-page.component.html',
  styleUrl: './edit-calibration-page.component.css'
})
export class EditCalibrationPageComponent {

}
