import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recommendations-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './recommendation-cards.component.html',
  styleUrls: ['./recommendation-cards.component.css']
})
export class RecommendationsCardComponent {
  @Input() recommendations: { message: string; type: 'success' | 'warning' | 'info' }[] = [];
}
