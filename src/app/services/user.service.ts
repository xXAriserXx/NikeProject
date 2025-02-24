import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { IUser } from '../../../server/models/IUser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  apiLogin:string = `${environment.apiUrl}/users`

  register (user) { 
    return this.http.post(`${this.apiLogin}/register`, user)
  }

  login (userCredentials) { 
    return this.http.post(`${this.apiLogin}/login`, userCredentials)
  }

  getUserData() : IUser {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded:IUser = jwtDecode(token);
      return decoded; 
    }
    return null;
  }

  logOut () {
    localStorage.setItem("authToken", "")
  }

}
