import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Drink } from '../models/drink.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends BaseService<Drink> {
  constructor() {
    super();
    this.resourceEndpoint = environment.recipesEndpointPath;
  }
}
