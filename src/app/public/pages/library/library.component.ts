import { Component } from '@angular/core';
import {
  ViewConsultationsComponent
} from '../../../consultations/components/view-consultations/view-consultations.component';
import {ToolbarComponent} from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-library',
  imports: [
    ViewConsultationsComponent,
    ToolbarComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {

}
