import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICart } from '../../../server/models/ICart';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { } 

  apiCart = "http://localhost:3000/carts"


  getUserCart (userId) { 
    return this.http.get(`${this.apiCart}/${userId}`)
  }

  updateQuantity (shoe: any, action: "increase" | "decrease" | "remove" | "add") {
    console.log("the new one is working")
    return this.http.patch(`${this.apiCart}/update-quantity`, { shoe, action })
  }

  updateQuantityGuest (shoe:any, action: "increase" | "decrease" | "remove" | "add") {
    const cart:ICart = JSON.parse(localStorage.getItem("cart"))
    const shoeIndex = cart.shoes.findIndex((shoeCart:IShoeCart) => { return shoeCart.color === shoe.color && shoeCart.size === shoe.size && shoeCart.shoeId === shoe.shoeId})
    if (action === "increase") {
      cart.shoes[shoeIndex].quantity++
    } else if (action === "decrease" && cart.shoes[shoeIndex].quantity > 1) {
      cart.shoes[shoeIndex].quantity--
    } else if (action === "remove") {
      cart.shoes.splice(shoeIndex, 1)
    } 
    return cart
  }

  getGuestCart () {
    return JSON.parse(localStorage.getItem("cart"))
  }

  emptyCart () {
    return this.http.patch(`${this.apiCart}/empty`, "")
  }

  getQuantityGuest () {
    const quantity:number = (JSON.parse(localStorage.getItem("cart")) as ICart).shoes.length
    return quantity
  }

  getQuantityUser (userId) {
    return this.http.get(`${this.apiCart}/${userId}`).pipe(
      map((cart:ICart) => cart.shoes.length)
    )
  }


}
