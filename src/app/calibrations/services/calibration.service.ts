import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service"
import {Calibration} from '../model/calibration.entity';
import {environment} from '../../../environments/environment'

const calibrationsResourceEndpointPath =environment.calibrationsEndpointPath
@Injectable({
  providedIn: 'root'
})
export class CalibrationService extends BaseService<Calibration>{

  constructor() {
    super()
    this.resourceEndpoint=calibrationsResourceEndpointPath;
  }
}
