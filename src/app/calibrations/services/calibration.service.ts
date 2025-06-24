import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from "../../shared/services/base.service";
import { Calibration } from '../model/calibration.entity';
import { CalibrationAssembler } from './assemblers/calibration.assembler';
import { environment } from '../../../environments/environment';
import { CalibrationResource } from './responses/calibration.response';

@Injectable({
  providedIn: 'root'
})
export class CalibrationService extends BaseService<Calibration> {
  constructor() {
    super();
    this.serverBaseUrl = environment.serverBaseUrl;
    this.resourceEndpoint = environment.calibrationsEndpointPath;
  }

  getCalibrations(): Observable<Calibration[]> {
    return this.http.get<CalibrationResource[]>(`${this.serverBaseUrl}${this.resourceEndpoint}`).pipe(
      map(response => CalibrationAssembler.toEntitiesFromResponse(response))
    );
  }

  saveCalibration(calibration: Calibration): Observable<Calibration> {
    const resource = CalibrationAssembler.toResourceFromEntity(calibration);
    return this.http.post<CalibrationResource>(`${this.serverBaseUrl}${this.resourceEndpoint}`, resource).pipe(
      map(response => CalibrationAssembler.toEntityFromResource(response))
    );
  }
}
