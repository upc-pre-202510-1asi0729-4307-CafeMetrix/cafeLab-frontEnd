import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'https://682697d8397e48c913169c83.mockapi.io/suppliers';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los proveedores registrados
   */
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl)
      .pipe(
        retry(1),
        tap(suppliers => console.log('Fetched suppliers:', suppliers)),
        catchError(this.handleError)
      );
  }

  /**
   * Registrar un nuevo proveedor
   */
  addSupplier(supplier: Supplier): Observable<Supplier> {
    console.log('Adding supplier:', supplier);

    return this.http.post<Supplier>(this.apiUrl, supplier, this.httpOptions)
      .pipe(
        tap(newSupplier => console.log(`Added supplier w/ id=${newSupplier.id}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar un proveedor existente
   */
  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${supplier.id}`, supplier, this.httpOptions)
      .pipe(
        tap(() => console.log(`Updated supplier with id=${supplier.id}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar un proveedor por su ID
   */
  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(() => console.log(`Deleted supplier with id=${id}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Buscar proveedores usando query (nombre, email, etc.)
   */
  searchSuppliers(query: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}?q=${query}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores genérico
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Se produjo un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifique su conexión.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Código de error ${error.status}: ${error.message}`;
          break;
      }
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
