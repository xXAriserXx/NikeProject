import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { IOrder } from '../../../server/models/IOrder';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { IFavorite } from '../../../server/models/IFavorite';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { IUser } from '../../../server/models/IUser';
import { CapitalizeFirstPipe } from '../pipes/capitalize-first.pipe';
import { EuroPipe } from '../pipes/euro.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink, CapitalizeFirstPipe, EuroPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (private orderService:OrderService, private userService:UserService, private router:Router, private favoritesService:FavoritesService, private productService:ProductService) { }

  orders:IOrder[] = []
  favorites:IFavorite[] = []
  random:IShoe[] = []
  user:IUser
  emptyFav:boolean = false
    
  ngOnInit () {

    this.user = this.userService.getUserData()

    this.orderService.getOrders().subscribe({
      next: (data:any) => {
        this.orders = data.ordersFound
        console.log(data)
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })

    this.favoritesService.getFavorites().subscribe({
      next: (response: {msg:string, favoritesFound:IFavorite[]}) => {
        this.favorites = response.favoritesFound
        if (response.favoritesFound[0].favoriteItems.length !== 0) {
          this.emptyFav = false
        } else {
          this.emptyFav = true
        }
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })

    this.getRandomShoes()
  }

  logOut () {
    this.userService.logOut()
    this.router.navigate(['/home'])
  }

  removeFavorite (favoriteToRemove) {
    this.favoritesService.removeFavorite(favoriteToRemove).subscribe({
      next: (data: { msg: string, updatedFavorites: IFavorite[] }) => {
        console.log(data)
        this.favorites = data.updatedFavorites
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })
  }

  getRandomShoes () {
    this.productService.getRandomShoes().subscribe({
      next: (data: IShoe[]) => {
        this.random = data
      },
      error: () => {},
      complete: () => {}
    })
  }
}
