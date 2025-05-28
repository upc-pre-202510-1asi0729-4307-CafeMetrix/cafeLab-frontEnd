import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-welcome-barista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ToolbarComponent
  ],
  templateUrl: './welcome-barista.component.html',
  styleUrls: ['./welcome-barista.component.css']
})
export class WelcomeBaristaComponent {

}
