import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Portfolio } from '../models/portfolio.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService extends BaseService<Portfolio> {
  constructor() {
    super();
    this.resourceEndpoint = environment.portfoliosEndpointPath;
  }
}
