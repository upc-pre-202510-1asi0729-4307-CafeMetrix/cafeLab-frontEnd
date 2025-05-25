import { Component } from '@angular/core';
import {FileComponent} from '../../components/file/file.component';

@Component({
  selector: 'app-view-file',
  imports: [
    FileComponent
  ],
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.css'
})
export class ViewFileComponent {

}
