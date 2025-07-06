import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Puedes hacer más chequeos aquí si quieres validar el token
    if (this.tokenService.getToken()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
