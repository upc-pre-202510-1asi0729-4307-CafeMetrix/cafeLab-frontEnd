import { Component, Input } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DecimalPipe} from '@angular/common';
@Component({
  selector: 'app-metrics-card',
  standalone: true,
  templateUrl: './metrics-card.component.html',
  imports: [
    MatCard,
    MatCardContent,
    DecimalPipe
  ],
  styleUrls: ['./metrics-card.component.css']
})
export class MetricsCardComponent {
  @Input() costPerKg!: number;
  @Input() potentialMargin!: number;
  @Input() suggestedPrice!: number;
}
