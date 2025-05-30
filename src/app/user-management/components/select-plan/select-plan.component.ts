import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ToolbarPlanComponent} from '../toolbar-plan/toolbar-plan.component';
import { FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';


@Component({
  standalone: true,
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.css'],
  imports: [RouterModule, TranslateModule, ToolbarPlanComponent, FormsModule, TranslateModule, CommonModule, MatToolbar, ToolbarComponent],
})
export class SelectPlanComponent {

  baristaFeatures: string[];
  ownerFeatures: string[];
  fullFeatures: string[];

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.baristaFeatures = this.translate.instant('PLANS.BARISTA.FEATURES');
    this.ownerFeatures = this.translate.instant('PLANS.OWNER.FEATURES');
    this.fullFeatures = this.translate.instant('PLANS.FULL.FEATURES');
  }

  selectPlan(type: string): void {
    let selected = {
      type,
      name: '',
      price: 0,
      features: []
    };

    switch (type) {
      case 'barista':
        selected.name = this.translate.instant('PLANS.BARISTA.TITLE');
        selected.price = 9;
        selected.features = this.translate.instant('PLANS.BARISTA.FEATURES');
        break;
      case 'owner':
        selected.name = this.translate.instant('PLANS.OWNER.TITLE');
        selected.price = 9;
        selected.features = this.translate.instant('PLANS.OWNER.FEATURES');
        break;
      case 'full':
        selected.name = this.translate.instant('PLANS.FULL.TITLE');
        selected.price = 15;
        selected.features = this.translate.instant('PLANS.FULL.FEATURES');
        break;
    }

    localStorage.setItem('selectedPlan', JSON.stringify(selected));
    void this.router.navigate(['/confirm-plan']);
  }

}
