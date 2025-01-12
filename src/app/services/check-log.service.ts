import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckLogService {

  constructor() { }

  loginStatus$ = new BehaviorSubject<boolean>(false);


  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Optionally, check if the token is valid or expired
        this.loginStatus$.next(true); // Update the login status
    } else {
        this.loginStatus$.next(false); // User is not logged in
    }
  }

  isLoggedIn(): boolean {
      return this.loginStatus$.value; // Returns the current login status
  }

}
