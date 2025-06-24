import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { CoffeeLot } from '../model/coffee-lot.model';

@Injectable({
  providedIn: 'root'
})
export class CoffeeLotService {
  private apiUrl = 'https://682697d8397e48c913169c83.mockapi.io/coffee-lots';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getLots(): Observable<CoffeeLot[]> {
    return this.http.get<CoffeeLot[]>(this.apiUrl)
      .pipe(
        retry(1),
        tap(lots => console.log('Fetched coffee lots-page:', lots)),
        catchError(this.handleError)
      );
  }

  getLotById(id: string): Observable<CoffeeLot> {
    return this.http.get<CoffeeLot>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(lot => console.log(`Fetched lot id=${lot.id}`)),
        catchError(this.handleError)
      );
  }

  addLot(lot: CoffeeLot): Observable<CoffeeLot> {
    if (!lot.supplier_id) {
      return throwError(() => new Error('El lote debe estar asociado a un proveedor.'));
    }

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

  deleteLot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(() => console.log(`Deleted coffee lot id=${id}`)),
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
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;

      if (error.status === 0) {
        errorMessage = 'No se puede conectar al servidor. Verifique su conexión o el estado del servidor.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
