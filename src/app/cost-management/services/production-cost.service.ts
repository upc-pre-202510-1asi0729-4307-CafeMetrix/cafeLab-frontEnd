import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, map, catchError } from 'rxjs';
import { CoffeeLot } from '../model/coffee-lot.model';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private apiUrl = '';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  //Get all coffee lots
  getLots(): Observable<CoffeeLot[]> {
    return this.http.get<CoffeeLot[]>(this.apiUrl).pipe(
      map(lots => lots.map(l => ({
        ...l
      }))),
      catchError(this.handleError)
    );
  }

  /**
   * Get lots by user id
   */
  getLotsByUserId(userId: string): Observable<CoffeeLot[]> {
    return this.getLots().pipe(
      map(lots => lots.filter(lot => lot.user_id === userId))
    );
  }

  /**
   * Error handling
   */
  private handleError(error: HttpErrorResponse) {
    let msg = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      msg = `Error del cliente: ${error.error.message}`;
    } else {
      msg = `Error ${error.status}: ${error.message}`;
    }
    console.error('Error en API de lotes:', msg);
    return throwError(() => new Error(msg));
  }
}
