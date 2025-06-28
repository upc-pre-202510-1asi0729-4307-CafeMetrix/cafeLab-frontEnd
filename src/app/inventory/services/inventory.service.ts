import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CoffeeLot } from '../../coffee-lot/model/coffee-lot.model';
import { InventoryEntry } from '../model/inventory-entry.entity';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryUrl = 'https://682697d8397e48c913169c83.mockapi.io/inventoryEntries';
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
    return this.http.get<CoffeeLot[]>(this.lotsUrl);
  }
}
