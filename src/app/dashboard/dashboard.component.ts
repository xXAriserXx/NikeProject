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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (private orderService:OrderService, private userService:UserService, private router:Router, private favoritesService:FavoritesService, private productService:ProductService) { }

  orders:IOrder[] = []
  favorites:IFavorite[] = []
  random:IShoe[] = []
    
  ngOnInit () {
    this.orderService.getOrders().subscribe({
      next: (data:any) => {
        this.orders = data.ordersFound
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })

    this.favoritesService.getFavorites().subscribe({
      next: (response:any) => {
        console.log(response.favoritesFound)
        this.favorites = response.favoritesFound
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
      next: (data) => {
        console.log(data)
        window.location.reload()
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })
  }

  getRandomShoes () {
    this.productService.getRandomShoes().subscribe({
      next: (data: IShoe[]) => {
        console.log(data)
        this.random = data
      },
      error: () => {},
      complete: () => {}
    })
  }
}
