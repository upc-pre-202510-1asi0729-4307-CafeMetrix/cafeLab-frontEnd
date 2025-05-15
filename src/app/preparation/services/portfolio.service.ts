import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../shared/services/base.service';
import { Portfolio } from '../../shared/domain/models/portfolio.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService extends BaseService<Portfolio> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = environment.portfoliosEndpointPath;
  }
}
