import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from "../../shared/services/base.service";
import { Coffee } from '../model/coffe.entity';
import { CoffeesResponse } from './responses/coffe.response'
import { CoffeeAssembler } from './assemblers/coffee.assembler';
import { environment } from '../../../environments/environment';
import { CoffeeResource } from './responses/coffe.response'
@Injectable({
  providedIn: 'root'
})
export class CoffeeService extends BaseService<Coffee> {
  constructor() {
    super();
    this.serverBaseUrl = environment.serverBaseUrl;
    this.resourceEndpoint = environment.coffeesEndpointPath;
  }

  getCoffees(): Observable<Coffee[]> {
    return this.http.get<CoffeeResource[]>(`${this.serverBaseUrl}${this.resourceEndpoint}`).pipe(
      map(response => CoffeeAssembler.toEntitiesFromResponse(response))
    );
  }

  saveCoffee(coffee: Coffee): Observable<Coffee> {
    const resource = CoffeeAssembler.toResourceFromEntity(coffee);

    return this.http.post<CoffeeResource>(`${this.serverBaseUrl}${this.resourceEndpoint}`, resource).pipe(
      map(response => CoffeeAssembler.toEntityFromResource(response))
    )
  }
}
