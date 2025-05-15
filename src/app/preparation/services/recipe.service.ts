import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drink } from '../../shared/domain/models/drink.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.serverBaseUrl}${environment.recipesEndpointPath}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Drink[]> {
    return this.http.get<Drink[]>(this.apiUrl);
  }

  getById(id: number): Observable<Drink> {
    return this.http.get<Drink>(`${this.apiUrl}/${id}`);
  }

  create(drink: Drink): Observable<Drink> {
    return this.http.post<Drink>(this.apiUrl, drink);
  }

  update(id: number, drink: Drink): Observable<Drink> {
    return this.http.put<Drink>(`${this.apiUrl}/${id}`, drink);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
