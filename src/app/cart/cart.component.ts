import { Component } from '@angular/core';
import { ICart } from '../../../server/models/ICart';
import { CommonModule } from '@angular/common';
import { CheckLogService } from '../services/check-log.service';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService) {}
  cart:ICart = {userId: undefined, shoes: []}
  isLoggedIn: boolean
  

  ngOnInit () { 
    this.isLoggedIn = this.checkLogService.isLoggedIn()

    if (this.isLoggedIn) {

      const userId = this.userService.getUserData()._id
      this.cartService.getUserCart(userId).subscribe({
        next: (userCart:ICart) => {
          this.cart = userCart
        },
        error: (error) => {console.log(error)},
        complete: () => {}
      })

    } else {

      this.cart = JSON.parse(localStorage.getItem("cart"))
      console.log(this.cart)

    }

  }

  /*So basically i get the id of the shoes, through these id i should get the images and some other things  */

}
