import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IShoeCart } from '../../../server/models/IShoeCart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  apiOrders:string = `${environment.apiUrl}/orders`

  createOrder (orderToAdd:IShoeCart[], total:number, discount:number) {
    return this.http.post(this.apiOrders, {orderToAdd, total, discount} )
  }

  getOrders () {
    return this.http.get(this.apiOrders)
  }

}
