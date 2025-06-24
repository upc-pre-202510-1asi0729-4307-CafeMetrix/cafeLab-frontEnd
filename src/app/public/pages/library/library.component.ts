import { Component } from '@angular/core';
import {
  ViewConsultationsComponent
} from '../../../consultations/components/view-consultations/view-consultations.component';
import {ToolbarComponent} from '../../components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    ViewConsultationsComponent,
    ToolbarComponent,
    MatToolbar
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {

}
