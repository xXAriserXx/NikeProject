import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFavorite } from '../../../server/models/IFavorite';
import { IShoeFav } from '../../../server/models/IShoeFav';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http:HttpClient) { }

  apiFavorites:string = "http://localhost:3000/favorites"

  getFavoritesGuest () {
  }

  addFavorite (shoeFav:IShoeFav) {
    console.log(shoeFav)
    return this.http.patch(this.apiFavorites, {shoeFav})
  }

  removeFavorite (shoeIndex) {
    return this.http.patch(`${this.apiFavorites}/remove`, {shoeIndex})
  }

  getFavorites () {
    return this.http.get(this.apiFavorites)
  }


}
