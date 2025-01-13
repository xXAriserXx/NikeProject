import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '../../../server/models/IOrder';
import { IShoeCart } from '../../../server/models/IShoeCart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  apiOrders:string = "http://localhost:3000/orders"

  createOrder (order:IShoeCart[]) {
    console.log(order)
    return this.http.post(this.apiOrders, {order} )
  }

  getOrders () {
    return this.http.get(this.apiOrders)
  }

}
