import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICart } from '../../../server/models/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { } 

  apiShoes = "http://localhost:3000/carts"


  createCart (userId) { //this method should be called when the user registers
    return this.http.post(this.apiShoes, {userId: userId, shoes: []})
  }

  addToCart(shoe: any, userId) {
    return this.http.patch(`${this.apiShoes}/${userId}`, { shoe });
  }


  getUserCart (userId) { //this gets the user cart
    return this.http.get(`${this.apiShoes}/${userId}`)
  }
}
