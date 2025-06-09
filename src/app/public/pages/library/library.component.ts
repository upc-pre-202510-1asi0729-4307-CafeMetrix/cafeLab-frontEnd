import { Component } from '@angular/core';
import {
  ViewConsultationsComponent
} from '../../../consultations/components/view-consultations/view-consultations.component';

@Component({
  selector: 'app-library',
  imports: [
    ViewConsultationsComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {

}
