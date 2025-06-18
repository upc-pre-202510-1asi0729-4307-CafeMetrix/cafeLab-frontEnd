import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-options',
  imports: [
    MatCard,
    MatCardContent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './dashboard-options.component.html',
  styleUrl: './dashboard-options.component.css'
})
export class DashboardOptionsComponent {

}
