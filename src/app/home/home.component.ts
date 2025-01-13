import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckLogService } from '../services/check-log.service';
import {jwtDecode} from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { IshoeOrders } from '../../../server/models/IShoeOrders';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor (private checkLogService:CheckLogService, private productService:ProductService) {}

  isLoggedIn:boolean = false
  userId:string
  bestSellers:IShoe[]
  newArrivals:IShoe[]

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()

    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = jwtDecode<{ _id: string }>(token);
      this.userId = payload._id
    }

    this.productService.getBestSellers().subscribe({
      next:(data:IShoe[]) => {
        this.bestSellers = data
        console.log(this.bestSellers)
      },
      error:() => {},
      complete:() => {}
    })

    this.productService.getNewArrivals().subscribe({
      next:(data:IShoe[]) => {
        console.log(data)
        this.newArrivals = data
      },
      error:() => {},
      complete:() => {}
    })

  }


}
