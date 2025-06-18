import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from "../../shared/services/base.service";
import { Defect } from '../model/defect.entity';
import { DefectsResponse } from './responses/defect.response';
import { DefectAssembler } from './assemblers/defect.assembler';
import { environment } from '../../../environments/environment';
import { DefectResource } from './responses/defect.response';
@Injectable({
  providedIn: 'root'
})
export class DefectService extends BaseService<Defect> {
  constructor() {
    super();
    this.serverBaseUrl = environment.serverBaseUrl;
    this.resourceEndpoint = environment.defectsEndpointPath;
  }

  getDefects(): Observable<Defect[]> {
    return this.http.get<DefectResource[]>(`${this.serverBaseUrl}${this.resourceEndpoint}`).pipe(
      map(response => DefectAssembler.toEntitiesFromResponse(response))
    );
  }

  saveDefect(defect: Defect): Observable<Defect> {
    const resource = DefectAssembler.toResourceFromEntity(defect);
    return this.http.post<DefectResource>(`${this.serverBaseUrl}${this.resourceEndpoint}`, resource).pipe(
      map(response => DefectAssembler.toEntityFromResource(response))
    );
  }
}
