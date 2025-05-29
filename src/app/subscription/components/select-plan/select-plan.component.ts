import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../auth/services/user.service';
import { User } from '../../../auth/model/user.entity';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
//Esto se debe seguir importando porque es el toolbar inicial
import { ToolbarinitComponent } from '../../../public/components/toolbarinit/toolbarinit.component';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.css'],
  standalone: true,
  imports: [ToolbarinitComponent, MatButton, TranslatePipe]
})
export class SelectPlanComponent {
  constructor(private router: Router, private userService: UserService) {}

  onSelectPlan(plan: string) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}') as User;
    const updatedUser: User = {
      ...currentUser,
      plan: plan,
      hasPlan: true
    };

    this.userService.updateProfile(currentUser.id, updatedUser).subscribe({
      next: (user: User) => {
        console.log('Updated user:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.redirectToDashboard(plan);
      },
      error: (error: any) => {
        console.error('Update profile error:', error);
      }
    });
  }

  redirectToDashboard(plan: string) {
    switch (plan) {
      case 'barista':
        this.router.navigate(['/dashboard/barista']);
        break;
      case 'admin':
        this.router.navigate(['/dashboard/owner']);
        break;
      case 'complete':
        this.router.navigate(['/dashboard/complete']);
        break;
      default:
        break;
    }
  }
}
