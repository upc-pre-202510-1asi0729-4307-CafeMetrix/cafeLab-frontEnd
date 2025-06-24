import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MoreInfoCalibrationComponent} from '../../components/more-info-calibration/more-info-calibration.component';

@Component({
  selector: 'app-more-info-page',
  imports: [
    MatToolbar,
    ToolbarComponent,
    MoreInfoCalibrationComponent
  ],
  templateUrl: './more-info-page.component.html',
  styleUrl: './more-info-page.component.css'
})
export class MoreInfoPageComponent {

}
