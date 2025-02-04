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

  addFavorite (shoeFav:IShoeFav) {
    return this.http.patch(this.apiFavorites, {shoeFav})
  }

  removeFavorite (favorite) {
    console.log(favorite)
    return this.http.patch(`${this.apiFavorites}/remove`, {favorite})
  }

  getFavorites () {
    return this.http.get(this.apiFavorites)
  }

  

}
