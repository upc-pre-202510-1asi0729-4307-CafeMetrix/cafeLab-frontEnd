import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment';
import { Observable, catchError, map } from 'rxjs';

const usersResourceEndpointPath = environment.usersEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  constructor() {
    super();
    this.resourceEndpoint = usersResourceEndpointPath;
  }

  /**
   * Authenticates a user by email and password
   * @param email - The user's email
   * @param password - The user's password
   * @returns An Observable of the authenticated user
   */
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.resourcePath()}?email=${email}&password=${password}`).pipe(
        map(users => {
          if (users.length === 1) {
            return users[0];
          } else {
            throw new Error('Invalid email or password');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registers a new user
   * @param user - The user to register
   * @returns An Observable of the registered user
   */
  register(user: User): Observable<User> {
    return this.create(user);
  }

  /**
   * Updates a user's profile
   * @param userId - The ID of the user to update
   * @param updatedUser - The updated user data
   * @returns An Observable of the updated user
   */
  updateProfile(userId: number, updatedUser: User): Observable<User> {
    return this.update(userId, updatedUser);
  }

  /**
   * Retrieves a user by ID
   * @param userId - The ID of the user to retrieve
   * @returns An Observable of the requested user
   */
  getUserById(userId: number): Observable<User> {
    return this.getById(userId);
  }

  /**
   * Retrieves all users
   * @returns An Observable array of all users
   */
  getAllUsers(): Observable<User[]> {
    return this.getAll();
  }
}
