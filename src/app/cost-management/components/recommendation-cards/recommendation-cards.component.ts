import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recommendations-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './recommendation-cards.component.html',
  styleUrls: ['./recommendation-cards.component.css']
})
export class RecommendationsCardComponent {
  @Input() recommendations: Recommendation[] = [];
}

interface Recommendation {
  message: string;
  type: 'success' | 'warning' | 'info';
}
