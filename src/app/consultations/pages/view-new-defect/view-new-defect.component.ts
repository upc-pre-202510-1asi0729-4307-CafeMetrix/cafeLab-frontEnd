import { Component } from '@angular/core';
import {AddConsultationComponent} from '../../components/add-consultation/add-consultation.component';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-view-new-defect',
  standalone: true,
  imports: [
    AddConsultationComponent,
    ToolbarComponent,
    MatToolbar
  ],
  templateUrl: './view-new-defect.component.html',
  styleUrl: './view-new-defect.component.css'
})
export class ViewNewDefectComponent {

}
