import { Component } from '@angular/core';
import { ICart } from '../../../server/models/ICart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CheckLogService } from '../services/check-log.service';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService) {}
  cart:ICart = {userId: undefined, shoes: []}
  isLoggedIn: boolean
  totalPrice: number
  

  ngOnInit () { 
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()

    if (this.isLoggedIn) {

      const userId = this.userService.getUserData()._id
      this.cartService.getUserCart(userId).subscribe({
        next: (userCart:ICart) => {
          this.cart = userCart
          this.calcTotPrice(this.cart)
        },
        error: (error) => {console.log(error)},
        complete: () => {}
      })

    } else {

      this.cart = JSON.parse(localStorage.getItem("cart"))
      console.log(this.cart)

    }

    this.calcTotPrice(this.cart)
  }
  
  updateQuantity (shoe, action) {
     this.cartService.updateQuantity(shoe, action).subscribe({
      next: (data:any) => {
        console.log(data)
        this.cart = data.cart
        this.calcTotPrice(this.cart)
      },
      error: (error) => {console.log(error)},
      complete: () => {}

     })
  }

calcTotPrice(cart: ICart) {
  this.totalPrice = +cart.shoes.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0).toFixed(2);
  console.log(this.totalPrice);
}


}
