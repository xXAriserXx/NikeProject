import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { ICart } from '../../../server/models/ICart';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../services/order.service';
import { IOrder } from '../../../server/models/IOrder';
import { IShoeCart } from '../../../server/models/IShoeCart';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  constructor (private cartService:CartService, private userService:UserService, private router:Router, private orderService:OrderService) {}

  userId:string
  cart:ICart = {userId: undefined, shoes: []}
  order:IShoeCart[]

  ngOnInit () {
    this.userId = this.userService.getUserData()._id
    this.cartService.getUserCart(this.userId).subscribe({
      next: (data:ICart) => {
        console.log(data)
        this.cart = data
        this.order = data.shoes
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })
  }

  onPurchase () {
    console.log(this.order)
    this.orderService.createOrder(this.order).subscribe({
      next: (data) => {
        console.log(data)
        this.cartService.emptyCart().subscribe({
          next: (data) => {console.log(data)},
          error: (error) => {console.log(error)},
          complete: () => {}
        })
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })
    this.router.navigate(["/thankYou"])
  }

}
