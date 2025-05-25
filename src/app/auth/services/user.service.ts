import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service"
import {User} from '../model/user.entity'
import {environment} from '../../../environments/environment'

const usersResourceEndpointPath = environment.usersEndpointPath
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor() {
    super();
    this.resourceEndpoint = usersResourceEndpointPath
  }
}
