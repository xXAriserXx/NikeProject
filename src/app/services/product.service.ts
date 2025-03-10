import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IFilterParams } from '../../../server/models/IFilterParams';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  apiShoes = `${environment.apiUrl}/shoes`
  
  getAllShoes() {
    return this.http.get(`${this.apiShoes}`)
  }

  getShoesPG (page: number, limit: number, name?:string, filter?:IFilterParams) {

    let params = new HttpParams().set("page", page).set("limit", limit)
    if (name) {
      params = params.set("name", name)
    }
    if (filter) {
      params = params.set("filter", JSON.stringify(filter))
    }
    return this.http.get(`${this.apiShoes}`, { params })
  }

  getNewArrivals () {
    console.log(`${this.apiShoes}/newArrivals`)
    return this.http.get(`${this.apiShoes}/newArrivals`)
  }

  getBestSellers () {

    return this.http.get(`${this.apiShoes}/bestSellers`)
  }


  getDetailShoe (id) {
    console.log("request made to get the details of the shoe")
    return this.http.get(`${this.apiShoes}/${id}`)
  }

  getShoesByName (userInput) {
    if (userInput !== "") {
      return this.http.get(`${this.apiShoes}/byName/${encodeURIComponent(userInput)}`)
    } else {
      return of([])
    }
  }
/*
  getFilteredShoes(filter) {
    console.log('Filter:', filter);
    return this.http.get(`${this.apiShoes}`).pipe(
      map((shoes: any[]) => {
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
  } */
  
  getFilteredShoesDB (filter) {
    console.log(filter)
    return this.http.post(`${this.apiShoes}/filter`, filter)
  }

  getRandomShoes() {
    return this.http.get(`${this.apiShoes}/random`)
  }


;

}

