import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CoffeeLot } from '../../cost-management/model/coffee-lot.model';
import { InventoryEntry } from '../model/inventory-entry.entity';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryUrl = 'https://685056e8e7c42cfd17984fb7.mockapi.io/api/v1/inventoryEntries';
  private lotsUrl = 'https://682697d8397e48c913169c83.mockapi.io/coffee-lots';

  constructor(private http: HttpClient) {}

  getInventoryEntries(): Observable<InventoryEntry[]> {
    return this.http.get<InventoryEntry[]>(this.inventoryUrl);
  }

  addInventoryEntry(entry: InventoryEntry): Observable<InventoryEntry> {
    return this.http.post<InventoryEntry>(this.inventoryUrl, entry);
  }

  deleteInventoryEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.inventoryUrl}/${id}`);
  }

  getCoffeeLots(): Observable<CoffeeLot[]> {
    return this.http.get<any[]>(this.lotsUrl).pipe(
      map(data =>
        data.map(item => ({
          id: item.id,
          name: item.lot_name,
          variety: item.coffee_type,
          origin: item.origin,
          quantityKg: item.weight
        }))
      )
    );
  }
}
