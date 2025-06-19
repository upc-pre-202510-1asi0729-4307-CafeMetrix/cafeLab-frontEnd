import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface CoffeeLot {
  id: number;
  lot_name: string;
}

export interface RoastProfile {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoffeeDataService {
  private lotService: BaseService<CoffeeLot>;
  private roastService: BaseService<RoastProfile>;

  constructor() {
    this.lotService = new (class extends BaseService<CoffeeLot> {
      constructor() {
        super();
        this.resourceEndpoint = environment.coffeeLotsEndpointPath;
      }
    })();

    this.roastService = new (class extends BaseService<RoastProfile> {
      constructor() {
        super();
        this.resourceEndpoint = environment.roastProfilesEndpointPath;
      }
    })();
  }

  getCoffeeLots(): Observable<CoffeeLot[]> {
    return this.lotService.getAll();
  }

  getRoastProfiles(): Observable<RoastProfile[]> {
    return this.roastService.getAll();
  }
} 