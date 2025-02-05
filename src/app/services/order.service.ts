import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviromment';
import { IShoeCart } from '../../../server/models/IShoeCart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  apiOrders:string = `${environment.apiUrl}/orders`

  createOrder (order:IShoeCart[]) {
    console.log(order)
    return this.http.post(this.apiOrders, {order} )
  }

  getOrders () {
    return this.http.get(this.apiOrders)
  }

}
