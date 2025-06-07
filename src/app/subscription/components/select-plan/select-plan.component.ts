import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ToolbarPlanComponent} from '../toolbar-plan/toolbar-plan.component';
import { FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {UserService} from '../../../auth/services/user.service';
import {User} from '../../../auth/model/user.entity';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';


interface Plan {
  type: string;
  name: string;
  translationKey: string;
  price: number;
  features: string[];
}

@Component({
  standalone: true,
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.css'],
  imports: [RouterModule, TranslateModule, ToolbarPlanComponent, FormsModule, TranslateModule, CommonModule, MatToolbar, ToolbarPlanComponent],
})
export class SelectPlanComponent {

  baristaFeatures: string[] = [];
  ownerFeatures: string[] = [];
  fullFeatures: string[] = [];
  constructor(
      private router: Router,
      private translate: TranslateService,
      private userService: UserService
  ) {
    this.translate.get('PLANS.BARISTA.FEATURES').subscribe((res: string[]) => this.baristaFeatures = res);
    this.translate.get('PLANS.OWNER.FEATURES').subscribe((res: string[]) => this.ownerFeatures = res);
    this.translate.get('PLANS.FULL.FEATURES').subscribe((res: string[]) => this.fullFeatures = res);
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }
  loadTranslations(): void {
    this.translate.get('PLANS.BARISTA.FEATURES').subscribe((res: string[]) => this.baristaFeatures = res);
    this.translate.get('PLANS.OWNER.FEATURES').subscribe((res: string[]) => this.ownerFeatures = res);
    this.translate.get('PLANS.FULL.FEATURES').subscribe((res: string[]) => this.fullFeatures = res);
  }

  selectPlan(type: string): void {
    let selected: Plan = {
      type,
      name: '',
      translationKey: '',
      price: 0,
      features: []
    };

    switch (type) {
      case 'barista':
        selected.translationKey = 'PLANS.BARISTA.TITLE';
        selected.name = this.translate.instant(selected.translationKey);
        selected.price = 9;
        selected.features = this.baristaFeatures;
        break;
      case 'owner':
        selected.translationKey = 'PLANS.OWNER.TITLE';
        selected.name = this.translate.instant(selected.translationKey);
        selected.price = 9;
        selected.features = this.ownerFeatures;
        break;
      case 'full':
        selected.translationKey = 'PLANS.FULL.TITLE';
        selected.name = this.translate.instant(selected.translationKey);
        selected.price = 15;
        selected.features = this.fullFeatures;
        break;
    }


    localStorage.setItem('selectedPlan', JSON.stringify(selected));

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as User;
    const updatedUser: User = {
      ...currentUser,
      plan: type,
      hasPlan: false
    };

    this.userService.updateProfile(currentUser.id, updatedUser).subscribe({
      next: (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['subscription/confirm-plan']);
      },
      error: (error: any) => {
        console.error('Update profile error:', error);
      }
    });
  }

}
