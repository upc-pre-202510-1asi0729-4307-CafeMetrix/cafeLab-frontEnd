import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { CoffeeLot } from '../model/coffee-lot.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoffeeLotService extends BaseService<CoffeeLot> {
  constructor(private authService: AuthService) {
    super();
    this.resourceEndpoint = environment.coffeeLotsEndpointPath;
  }

  override getAll(): Observable<Array<CoffeeLot>> {
    return super.getAll().pipe(
      map(lots => lots.filter(lot => lot.userId === Number(this.authService.getCurrentUserId())))
    );
  }

  override create(lot: CoffeeLot): Observable<CoffeeLot> {
    if (!lot.supplier_id) {
      throw new Error('El lote debe estar asociado a un proveedor.');
    }
    lot.userId = Number(this.authService.getCurrentUserId());
    return super.create(lot);
  }

  override update(id: any, lot: CoffeeLot): Observable<CoffeeLot> {
    lot.userId = Number(this.authService.getCurrentUserId());
    return super.update(id, lot);
  }

  searchLots(query: string): Observable<CoffeeLot[]> {
    return this.getAll().pipe(
      map(lots => {
        const normalizedQuery = query.toLowerCase().trim();
        return lots.filter(lot =>
          lot.lot_name?.toLowerCase().includes(normalizedQuery) ||
          lot.supplier_id?.toString().includes(normalizedQuery) ||
          lot.coffee_type?.toLowerCase().includes(normalizedQuery)
        );
      })
    );
  }
}
