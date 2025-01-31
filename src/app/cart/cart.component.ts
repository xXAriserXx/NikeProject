import { Component } from '@angular/core';
import { ICart } from '../../../server/models/ICart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CheckLogService } from '../services/check-log.service';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, HeaderComponent, FooterComponent, EuroPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService) {}
  cart:ICart = {userId: undefined, shoes: []}
  isLoggedIn: boolean
  totalPrice: number
  couponCode: string = ""
  validCoupons: {code:string, discount:number}[] = [{code:'SAVE10', discount:10}, {code:'WELCOME15', discount:15}, {code:'BIGDEAL20', discount:20}];
  priceAfterDiscount: number

  ngOnInit () { 
    window.scroll(0, 0)
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
    this.priceAfterDiscount = this.totalPrice
  }
  
  updateQuantity (shoe, action) {
    if (this.isLoggedIn) {
     this.cartService.updateQuantity(shoe, action).subscribe({
      next: (data:any) => {
        console.log(data)
        this.cart = data.cart
        this.calcTotPrice(this.cart)
      },
      error: (error) => {console.log(error)},
      complete: () => {}

     })
    } else {
      this.cart = this.cartService.updateQuantityGuest(shoe, action)
      localStorage.setItem("cart", JSON.stringify(this.cart))
      this.calcTotPrice(this.cart)
    }

    this.applyCoupon()

  }

calcTotPrice(cart: ICart) {
  this.totalPrice = +cart.shoes.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0).toFixed(2);
  console.log(this.totalPrice);
}


applyCoupon () {
  if (this.validCoupons.some(validCoupon => this.couponCode === validCoupon.code)) {
    const discount:number = this.validCoupons.find(validCoupon => this.couponCode === validCoupon.code).discount
    this.priceAfterDiscount = this.totalPrice - ((this.totalPrice * discount) / 100)
    console.log(this.priceAfterDiscount)
  } else {
    alert("Coupon non valido")
  }
}


}

