import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CheckLogService {

  constructor() { }

  loginStatus$ = new BehaviorSubject<boolean>(false);


  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (!isExpired) {
          this.loginStatus$.next(true); 
        } else {
          this.loginStatus$.next(false); 
        }
      } catch (e) {
        this.loginStatus$.next(false); 
      }
    } else {
      this.loginStatus$.next(false); 
    }
  }

  isLoggedIn(): boolean {
      return this.loginStatus$.value; 
  }

}
