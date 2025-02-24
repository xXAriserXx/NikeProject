import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShoeFav } from '../../../server/models/IShoeFav';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http:HttpClient) { }

  apiFavorites:string = `${environment.apiUrl}/favorites`


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
