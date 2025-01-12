import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authToken');

    if (authToken  && req.url.includes('/users') || req.url.includes('/cart') || req.url.includes('/dashboard') || req.url.includes('/orders')) {
      const clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` }
      });
      return next.handle(clonedRequest);
    } else {
    }

    return next.handle(req); 
  }
}
