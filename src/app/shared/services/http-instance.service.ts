// src/app/shared/services/http-instance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInstanceService {
  private apiUrl = environment.serverBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET
   * @param endpoint Endpoint relativo a la API
   * @param params Parámetros de la petición
   * @returns Observable con la respuesta
   */
  get<T>(endpoint: string, params: any = {}): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<T>(url, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realiza una petición POST
   * @param endpoint Endpoint relativo a la API
   * @param data Datos a enviar
   * @returns Observable con la respuesta
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post<T>(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realiza una petición PUT
   * @param endpoint Endpoint relativo a la API
   * @param data Datos a enviar
   * @returns Observable con la respuesta
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.put<T>(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Realiza una petición DELETE
   * @param endpoint Endpoint relativo a la API
   * @returns Observable con la respuesta
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.delete<T>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error Error de la petición
   * @returns Observable con el error
   */
  private handleError(error: any) {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
}
