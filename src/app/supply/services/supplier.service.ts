import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Supplier } from '../models/supplier.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseService<Supplier> {
  constructor(private authService: AuthService) {
    super();
    this.resourceEndpoint = environment.suppliersEndpointPath;
  }

  override getAll(): Observable<Array<Supplier>> {
    return super.getAll().pipe(
      map(suppliers => suppliers.filter(supplier => supplier.userId === Number(this.authService.getCurrentUserId())))
    );
  }

  override create(supplier: Supplier): Observable<Supplier> {
    supplier.userId = Number(this.authService.getCurrentUserId());
    return super.create(supplier);
  }

  override update(id: any, supplier: Supplier): Observable<Supplier> {
    supplier.userId = Number(this.authService.getCurrentUserId());
    return super.update(id, supplier);
  }

  searchSuppliers(query: string): Observable<Supplier[]> {
    return this.getAll().pipe(
      map(suppliers => {
        const normalizedQuery = query.toLowerCase().trim();
        return suppliers.filter(supplier =>
          supplier.name?.toLowerCase().includes(normalizedQuery) ||
          supplier.email?.toLowerCase().includes(normalizedQuery) ||
          supplier.phone?.toString().includes(normalizedQuery)
        );
      })
    );
  }
}
