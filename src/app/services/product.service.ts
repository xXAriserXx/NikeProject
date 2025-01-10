import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  apiShoes = "http://localhost:3000/shoes"
  
  getAllShoes() {
    return this.http.get(this.apiShoes)
  }

  getDetailShoe (id) {
    return this.http.get(`${this.apiShoes}/${id}`)
  }

}
