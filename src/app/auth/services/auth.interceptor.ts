import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { TokenService } from './token.service';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  console.log('=== INTERCEPTOR DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Token exists:', !!token);
  console.log('Token value:', token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
    console.log('Final headers:', authReq.headers);
    console.log('Authorization header:', authReq.headers.get('Authorization'));
    console.log('Content-Type header:', authReq.headers.get('Content-Type'));
    console.log('=== END INTERCEPTOR DEBUG ===');
    return next(authReq);
  }

  const authReq = req.clone({
    headers: req.headers.set('Content-Type', 'application/json')
  });
  console.log('No token, only Content-Type added');
  console.log('=== END INTERCEPTOR DEBUG ===');
  return next(authReq);
};
