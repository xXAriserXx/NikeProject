import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { routes } from './app.routes';
import { LOCALE_ID } from '@angular/core'; 
import { registerLocaleData } from '@angular/common';   
import localeIt from '@angular/common/locales/it';  

registerLocaleData(localeIt, 'it');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'it' } 
  ]
};