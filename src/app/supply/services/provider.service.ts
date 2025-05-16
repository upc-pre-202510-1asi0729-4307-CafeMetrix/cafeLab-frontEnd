import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Provider } from '../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'https://682697d8397e48c913169c83.mockapi.io/providers';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getProviders(): Observable<Provider[]> {
    console.log('Getting providers from:', this.apiUrl);
    return this.http.get<Provider[]>(this.apiUrl)
      .pipe(
        retry(1),
        tap(providers => console.log('Fetched providers:', providers)),
        catchError(this.handleError)
      );
  }

  addProvider(provider: Provider): Observable<Provider> {
    console.log('Adding provider:', provider);
    console.log('API URL:', this.apiUrl);
    console.log('HTTP Options:', this.httpOptions);

    return this.http.post<Provider>(this.apiUrl, provider, this.httpOptions)
      .pipe(
        tap(newProvider => console.log(`Added provider w/ id=${newProvider.id}`)),
        catchError(this.handleError)
      );
  }

  updateProvider(provider: Provider): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/${provider.id}`, provider, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  searchProviders(query: string): Observable<Provider[]> {
    // JSON Server permite búsquedas con el parámetro q
    return this.http.get<Provider[]>(`${this.apiUrl}?q=${query}`)
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
