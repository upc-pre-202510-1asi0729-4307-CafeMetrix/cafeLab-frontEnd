import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Portfolio } from '../models/portfolio.entity';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService extends BaseService<Portfolio> {
  constructor(private authService: AuthService) {
    super();
    this.resourceEndpoint = environment.portfoliosEndpointPath;
  }

  override getAll(): Observable<Array<Portfolio>> {
    return super.getAll().pipe(
      map(portfolios => portfolios.filter(portfolio => portfolio.user_id === Number(this.authService.getCurrentUserId()))
    ));
  }

  override create(portfolio: Portfolio): Observable<Portfolio> {
    portfolio.user_id = Number(this.authService.getCurrentUserId());
    return super.create(portfolio);
  }

  override update(id: any, portfolio: Portfolio): Observable<Portfolio> {
    portfolio.user_id = Number(this.authService.getCurrentUserId());
    return super.update(id, portfolio);
  }
}
