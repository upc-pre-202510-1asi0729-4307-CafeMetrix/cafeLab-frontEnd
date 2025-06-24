import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {LotListComponent} from '../../components/lot-list/lot-list.component';

@Component({
  selector: 'app-lots-page',
  standalone: true,
  imports: [
    MatToolbar,
    ToolbarComponent,
    LotListComponent
  ],
  templateUrl: './lots.component.html',
  styleUrl: './lots.component.css'
})
export class LotsComponent {

}
