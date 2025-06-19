import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InventoryEntry } from '../model/inventory-entry.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://685056e8e7c42cfd17984fb7.mockapi.io/api/v1/inventoryEntries';

  constructor(private http: HttpClient) {}

  getInventoryEntries(): Observable<InventoryEntry[]> {
    return this.http.get<InventoryEntry[]>(this.apiUrl);
  }

  addInventoryEntry(entry: InventoryEntry): Observable<InventoryEntry> {
    return this.http.post<InventoryEntry>(this.apiUrl, entry);
  }

  deleteInventoryEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
