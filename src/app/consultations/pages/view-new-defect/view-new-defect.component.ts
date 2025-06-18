import { Component } from '@angular/core';
import {AddConsultationComponent} from '../../components/add-consultation/add-consultation.component';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-view-new-defect',
  imports: [
    AddConsultationComponent,
    ToolbarComponent
  ],
  templateUrl: './view-new-defect.component.html',
  styleUrl: './view-new-defect.component.css'
})
export class ViewNewDefectComponent {

}
