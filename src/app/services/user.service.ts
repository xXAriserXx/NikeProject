import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  apiLogin = "http://localhost:3000/users"

  register (user) { //this returns a message of successful register
    return this.http.post(`${this.apiLogin}/register`, user)
  }

  login (userCredentials) { // this returns the access token
    return this.http.post(`${this.apiLogin}/login`, userCredentials)
  }

  getUserData() : any {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded; // this contains the user data
    }
    return null;
  }

}
