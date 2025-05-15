import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  protected serverBaseUrl: string = environment.serverBaseUrl;
  protected resourceEndpoint: string = '/resources';

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.serverBaseUrl}${this.resourceEndpoint}`)
      .pipe(retry(2), catchError((error) => this.handleError(error)));
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<T>(`${this.serverBaseUrl}${this.resourceEndpoint}/${id}`)
      .pipe(retry(2), catchError((error) => this.handleError(error)));
  }

  create(item: T): Observable<T> {
    return this.http
      .post<T>(
        `${this.serverBaseUrl}${this.resourceEndpoint}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError((error) => this.handleError(error)));
  }

  update(id: number, item: T): Observable<T> {
    return this.http
      .put<T>(
        `${this.serverBaseUrl}${this.resourceEndpoint}/${id}`,
        JSON.stringify(item),
        this.httpOptions
      )
      .pipe(retry(2), catchError((error) => this.handleError(error)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.serverBaseUrl}${this.resourceEndpoint}/${id}`)
      .pipe(retry(2), catchError((error) => this.handleError(error)));
  }
}
