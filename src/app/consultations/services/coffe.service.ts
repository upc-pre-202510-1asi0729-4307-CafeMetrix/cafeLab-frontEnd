import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service"
import {Coffee} from '../model/coffe.entity';
import {environment} from '../../../environments/environment'

const coffeesResourceEndpointPath =environment.coffeesEndpointPath
@Injectable({
  providedIn: 'root'
})
export class CoffeeService extends BaseService<Coffee>{

  constructor() {
    super()
    this.resourceEndpoint=coffeesResourceEndpointPath
  }
}
