import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoffeeLot } from '../model/coffee-lot.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoffeeLotService {
  private apiUrl = 'https://682697d8397e48c913169c83.mockapi.io/coffee-lots';

  constructor(private http: HttpClient) {}

  getLots(): Observable<CoffeeLot[]> {
    return this.http.get<CoffeeLot[]>(this.apiUrl);
  }

  getLotsByUser(userId: string): Observable<CoffeeLot[]> {
    return this.http.get<CoffeeLot[]>(`${this.apiUrl}?user_id=${userId}`);
  }
}
