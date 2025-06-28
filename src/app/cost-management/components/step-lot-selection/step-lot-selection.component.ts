import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoffeeLot} from '../../model/coffee-lot.model';
import { CoffeeLotService} from '../../services/coffee-lot.service';
import {TranslateModule} from "@ngx-translate/core";
import { AuthService } from '../../../auth/services/AuthService';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-step-lot-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    TranslateModule
  ],
  templateUrl: './step-lot-selection.component.html',
  styleUrls: ['./step-lot-selection.component.css']
})
export class StepLotSelectionComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() progressValue:number = 0;
  @Input() onCancel!: () => void;

  lots: CoffeeLot[] = [];
  constructor(private coffeeLotService: CoffeeLotService, private authService: AuthService) {}
  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    this.coffeeLotService.getLots().pipe(
      catchError(err => {
        console.error('Error loading lots:', err);
        return of([]);
      })
    ).subscribe(lots => {
      this.lots = lots.filter(lot => lot.user_id === userId);
    });
  }
}
