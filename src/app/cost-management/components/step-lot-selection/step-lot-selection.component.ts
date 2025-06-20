import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoffeeLot} from '../../model/coffee-lot.model';
import { CoffeeLotService} from '../../services/coffee-lot.service';

@Component({
  selector: 'app-step-lot-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './step-lot-selection.component.html',
  styleUrls: ['./step-lot-selection.component.css']
})
export class StepLotSelectionComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() progressValue:number = 0;
  @Input() onCancel!: () => void;

  lots: CoffeeLot[] = [];
  constructor(private coffeeLotService: CoffeeLotService) {}
  ngOnInit(): void {
    this.coffeeLotService.getLots().subscribe(lots => {
      this.lots = lots;
    });
  }
}
