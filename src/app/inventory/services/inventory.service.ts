import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { CoffeeLot } from '../../coffee-lot/model/coffee-lot.model';
import { InventoryEntry } from '../model/inventory-entry.entity';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { CoffeeLotService } from '../../coffee-lot/services/coffee-lot.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService<InventoryEntry> {
  constructor(
    private authService: AuthService,
    private coffeeLotService: CoffeeLotService
  ) {
    super();
    this.resourceEndpoint = environment.inventoryEndpointPath;
  }

  override getAll(): Observable<Array<InventoryEntry>> {
    return super.getAll().pipe(
      map(entries => entries.filter(entry => entry.userId === Number(this.authService.getCurrentUserId())))
    );
  }

  override create(entry: InventoryEntry): Observable<InventoryEntry> {
    entry.userId = Number(this.authService.getCurrentUserId());
    return super.create(entry);
  }

  override update(id: any, entry: InventoryEntry): Observable<InventoryEntry> {
    entry.userId = Number(this.authService.getCurrentUserId());
    return super.update(id, entry);
  }

  override getById(id: number): Observable<InventoryEntry> {
    return super.getById(id);
  }

  getInventoryEntries(): Observable<InventoryEntry[]> {
    return this.getAll();
  }

  addInventoryEntry(entry: InventoryEntry): Observable<InventoryEntry> {
    return this.create(entry);
  }

  deleteInventoryEntry(id: number): Observable<void> {
    return this.delete(id);
  }

  getCoffeeLots(): Observable<CoffeeLot[]> {
    return this.coffeeLotService.getAll();
  }
}
