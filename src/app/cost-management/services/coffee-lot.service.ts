import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CoffeeLot } from '../model/coffee-lot.model';

@Injectable({
  providedIn: 'root'
})
export class CoffeeLotService {
  private mockLots: CoffeeLot[] = [
    { id: '1', name: 'Lote Amazonas', variety: 'Typica', origin: 'Amazonas', quantityKg: 200 },
    { id: '2', name: 'Lote Cajamarca', variety: 'Bourbon', origin: 'Cajamarca', quantityKg: 150 },
    { id: '3', name: 'Lote Cusco', variety: 'Caturra', origin: 'Cusco', quantityKg: 300 }
  ];

  getLots(): Observable<CoffeeLot[]> {
    return of(this.mockLots);
  }
}
