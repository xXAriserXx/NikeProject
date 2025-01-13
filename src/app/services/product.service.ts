import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  apiShoes = "http://localhost:3000/shoes"
  
  getAllShoes() {
    return this.http.get(`${this.apiShoes}`)
  }

  getNewArrivals () {
    return  this.http.get(`${this.apiShoes}/newArrivals`)
  }

  getBestSellers () {

    return  this.http.get(`${this.apiShoes}/bestSellers`)
  }


  getDetailShoe (id) {
    console.log("request made to get the details of the shoe")
    return this.http.get(`${this.apiShoes}/${id}`)
  }

  getFilteredShoes(filter) {
    console.log('Filter:', filter);
    return this.http.get(`${this.apiShoes}`).pipe(
      map((shoes: any[]) => {
        console.log('Shoes:', shoes);
        return shoes.filter(shoe => {
          const priceFilter = filter.price;
          let priceCondition = true;

          if (priceFilter.length > 0) {
            priceCondition = false;

            if (priceFilter.includes('50')) {
              priceCondition = priceCondition || (shoe.prezzo >= 50 && shoe.prezzo <= 100);
            }
            if (priceFilter.includes('100')) {
              priceCondition = priceCondition || (shoe.prezzo > 100 && shoe.prezzo <= 150);
            }
            if (priceFilter.includes('150')) {
              priceCondition = priceCondition || (shoe.prezzo > 150);
            }
          }

          const colorCondition = filter.color.length === 0 || filter.color.some(color => shoe.colori_disponibili.some(disponibile => disponibile.includes(color)));
          const categoryCondition = filter.category.length === 0 || filter.category.includes(shoe.categoria);

          return priceCondition && colorCondition && categoryCondition;
        });
      })
    );
  }

}

