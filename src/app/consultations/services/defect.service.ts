import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service"
import {Defect} from '../model/defect.entity';
import {environment} from '../../../environments/environment'

const defectsEndpointPath=environment.defectsEndpointPath
@Injectable({
  providedIn: 'root'
})
export class DefectService  extends  BaseService<Defect>{

  constructor() {
    super();
    this.resourceEndpoint=defectsEndpointPath
  }
}
