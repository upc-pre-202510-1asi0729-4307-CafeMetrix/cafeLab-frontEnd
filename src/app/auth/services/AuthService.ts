import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../model/user.entity';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private userService: UserService) {}

  login(email: string, password: string): Observable<User> {
    return this.userService.login(email, password).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user ? user.id.toString() : '';
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
