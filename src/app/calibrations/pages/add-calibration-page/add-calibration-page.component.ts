import { Component } from '@angular/core';
import {AddConsultationComponent} from '../../../consultations/components/add-consultation/add-consultation.component';
import {AddNewCalibrationComponent} from '../../components/add-new-calibration/add-new-calibration.component';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-add-calibration-page',
  imports: [
    AddConsultationComponent,
    AddNewCalibrationComponent,
    MatToolbar,
    ToolbarComponent
  ],
  templateUrl: './add-calibration-page.component.html',
  styleUrl: './add-calibration-page.component.css'
})
export class AddCalibrationPageComponent {

}
