import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { User } from '../model/user.entity';
import { environment } from '../../../environments/environment';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';

const usersResourceEndpointPath = environment.usersEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  constructor(protected override http: HttpClient, private tokenService: TokenService) {
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
   * POST OF A NEW USER PROFILE
   */
  createProfile(user: User): Observable<User> {
    return this.http.post<User>(`${environment.serverBaseUrl}/api/v1/profiles`, user);
  }

  /**
   * Updates a user's profile
   */
  updateProfile(profileId: number, updatedProfile: Partial<User>): Observable<User> {
    const authToken = this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.patch<User>(`${environment.serverBaseUrl}/api/v1/profiles/${profileId}`, updatedProfile, { headers: headers });
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

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${environment.serverBaseUrl}/api/v1/profiles?email=${email}`);
  }



}
