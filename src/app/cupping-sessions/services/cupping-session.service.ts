import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { CuppingSession } from '../model/cupping-session.entity';
import { environment } from '../../../environments/environment';

const cuppingSessionsResourceEndpointPath = environment.cuppingSessionsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class CuppingSessionService extends BaseService<CuppingSession> {
  constructor() {
    super();
    this.resourceEndpoint = cuppingSessionsResourceEndpointPath;
  }
}
