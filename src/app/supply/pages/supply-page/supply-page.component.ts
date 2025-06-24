import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {SupplierListComponent} from '../../components/provider-list/supplier-list.component';

@Component({
  selector: 'app-supply-page',
  standalone: true,
  imports: [
    MatToolbar,
    ToolbarComponent,
    SupplierListComponent
  ],
  templateUrl: './supply-page.component.html',
  styleUrl: './supply-page.component.css'
})
export class SupplyPageComponent {

}
