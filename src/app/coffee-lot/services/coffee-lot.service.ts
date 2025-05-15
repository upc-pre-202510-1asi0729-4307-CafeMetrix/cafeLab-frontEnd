import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { CoffeeLot } from '../models/coffee-lot.model';

@Injectable({
  providedIn: 'root'
})
export class CoffeeLotService {
  private apiUrl = 'http://localhost:3000/coffee-lots';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getLots(): Observable<CoffeeLot[]> {
    console.log('Getting coffee lots from:', this.apiUrl);
    return this.http.get<CoffeeLot[]>(this.apiUrl)
      .pipe(
        retry(1),
        tap(lots => console.log('Fetched coffee lots:', lots)),
        catchError(this.handleError)
      );
  }

  getLotById(id: number): Observable<CoffeeLot> {
    return this.http.get<CoffeeLot>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(lot => console.log(`Fetched lot id=${lot.id}`)),
        catchError(this.handleError)
      );
  }

  addLot(lot: CoffeeLot): Observable<CoffeeLot> {
    console.log('Adding coffee lot:', lot);
    return this.http.post<CoffeeLot>(this.apiUrl, lot, this.httpOptions)
      .pipe(
        tap(newLot => console.log(`Added coffee lot w/ id=${newLot.id}`)),
        catchError(this.handleError)
      );
  }

  updateLot(lot: CoffeeLot): Observable<CoffeeLot> {
    return this.http.put<CoffeeLot>(`${this.apiUrl}/${lot.id}`, lot, this.httpOptions)
      .pipe(
        tap(updatedLot => console.log(`Updated coffee lot id=${updatedLot.id}`)),
        catchError(this.handleError)
      );
  }

  deleteLot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted coffee lot id=${id}`)),
        catchError(this.handleError)
      );
  }

  searchLots(query: string): Observable<CoffeeLot[]> {
    return this.http.get<CoffeeLot[]>(`${this.apiUrl}?q=${query}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Se produjo un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      
      // Mensajes de error más específicos
      if (error.status === 0) {
        errorMessage = 'No se puede conectar al servidor. Por favor verifique su conexión o si el servidor está en ejecución.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor.';
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 