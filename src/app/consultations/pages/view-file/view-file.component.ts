import { Component } from '@angular/core';
import {FileComponent} from '../../components/file/file.component';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-view-file',
  imports: [
    FileComponent,
    ToolbarComponent
  ],
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.css'
})
export class ViewFileComponent {

}
