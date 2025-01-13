import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICart } from '../../../server/models/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { } 

  apiCart = "http://localhost:3000/carts"


  createCart (userId) { //this method should be called when the user registers
    return this.http.post(this.apiCart, {userId: userId, shoes: []})
  }

  getUserCart (userId) { //this gets the user cart
    return this.http.get(`${this.apiCart}/${userId}`)
  }

  updateQuantity (shoe: any, action: "increase" | "decrease" | "remove" | "add") {
    console.log("the new one is working")
    return this.http.patch(`${this.apiCart}/update-quantity`, { shoe, action })
  }

  emptyCart () {
    return this.http.patch(`${this.apiCart}/empty`, "")
  }


}
