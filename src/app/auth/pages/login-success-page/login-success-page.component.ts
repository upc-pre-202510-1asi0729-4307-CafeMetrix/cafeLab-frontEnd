import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.entity';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-success-page',
  templateUrl: './login-success-page.component.html',
  imports: [
    MatButton,
    TranslatePipe
  ],
  styleUrls: ['./login-success-page.component.css']
})
export class LoginSuccessPageComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onContinue() {
    if (this.currentUser?.isFirstLogin) {
      this.router.navigate(['/edit-profile']);
    } else {
      switch (this.currentUser?.plan) {
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
          this.router.navigate(['/subscription']);
          break;
      }
    }
  }
}
