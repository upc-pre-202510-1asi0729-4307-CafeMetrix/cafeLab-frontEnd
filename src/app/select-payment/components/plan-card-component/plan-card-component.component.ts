import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-plan-card-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon
  ],
  templateUrl: './plan-card-component.component.html',
  styleUrl: './plan-card-component.component.css'
})
export class PlanCardComponentComponent {

}
