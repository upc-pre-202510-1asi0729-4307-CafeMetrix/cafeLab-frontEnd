import { Component } from '@angular/core';
import {FileComponent} from '../../components/file/file.component';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-view-file',
  standalone: true,
  imports: [
    FileComponent,
    ToolbarComponent,
    MatToolbar
  ],
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.css'
})
export class ViewFileComponent {

}
