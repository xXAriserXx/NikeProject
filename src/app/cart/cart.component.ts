import { Component } from '@angular/core';
import { ICart } from '../../../server/models/ICart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CheckLogService } from '../services/check-log.service';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../services/favorites.service';
import { IShoeFav } from '../../../server/models/IShoeFav';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, HeaderComponent, FooterComponent, EuroPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService, private favoriteService:FavoritesService, private router:Router) {}
  cart:ICart = {userId: undefined, shoes: []}
  isLoggedIn: boolean
  totalPrice: number
  couponCode: string = ""
  coupons: {code:string, discount:number}[] = [{code:'SAVE10', discount:10}, {code:'WELCOME15', discount:15}, {code:'BIGDEAL20', discount:20}];
  priceAfterDiscount: number
  discountApplied:boolean = false
  validCoupon: boolean = true
  shoes:IShoeCart[] = []

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
          this.priceAfterDiscount = this.totalPrice
        },
        error: (error) => {console.log(error)},
        complete: () => {}
      })

    } else {

      this.cart = JSON.parse(localStorage.getItem("cart"))
      console.log(this.cart)
      this.calcTotPrice(this.cart)

    }

  }
  
  updateQuantity (shoe, action) {
    if (this.isLoggedIn) {
     this.cartService.updateQuantity(shoe, action).subscribe({
      next: (data:any) => {
        this.cart = data.cart
        this.calcTotPrice(this.cart)
        this.applyCouponAdded()
      },
      error: (error) => {console.log(error)},
      complete: () => {
      }

     })
    } else {
      this.cart = this.cartService.updateQuantityGuest(shoe, action)
      localStorage.setItem("cart", JSON.stringify(this.cart))
      this.calcTotPrice(this.cart)
      this.applyCouponAdded()
    }
  }

calcTotPrice(cart: ICart) {
  if (cart.shoes.length > 0) {
    this.totalPrice = +cart.shoes.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0).toFixed(2);
  } else {
    this.totalPrice = 0
    this.priceAfterDiscount = 0
  }
}


applyCoupon () {
  if (this.coupons.some(validCoupon => this.couponCode === validCoupon.code)) {
    const discount:number = this.coupons.find(validCoupon => this.couponCode === validCoupon.code).discount
    this.priceAfterDiscount = this.totalPrice - ((this.totalPrice * discount) / 100)
    const totalDiscount = (this.totalPrice * discount)/100
    console.log(totalDiscount)
    alert("Codice Coupon applicato")
    this.discountApplied = true
  } else {
    this.validCoupon = false
  }
}

applyCouponAdded () {
  if (this.coupons.some(validCoupon => this.couponCode === validCoupon.code)) {
    const discount:number = this.coupons.find(validCoupon => this.couponCode === validCoupon.code).discount
    this.priceAfterDiscount = this.totalPrice - ((this.totalPrice * discount) / 100)
    const totalDiscount = (this.totalPrice * discount)/100
    console.log(totalDiscount)
    this.discountApplied = true
  } else {
    this.priceAfterDiscount = this.totalPrice
  }

}

addFavorite (shoe:IShoeCart) {
  if (this.isLoggedIn) {
  const shoeFav:IShoeFav = {
    shoeId: shoe.shoeId,
    shoeName: shoe.shoeName,
    imageIcon: shoe.imageIcon
  }
    this.favoriteService.addFavorite(shoeFav).subscribe({
      next: (data) => {
        console.log(data)
        alert("Aggiunto ai preferiti")
      },
      error: (error:HttpErrorResponse) => {
        console.log(error)
        alert(error.error.msg)
      },
      complete: () => {}
    })
  } else {
    alert("Devi essere loggato per aggiungere ai preferiti")
  }
}

pay () {
  if (this.totalPrice !== 0) {
    this.router.navigate(['/payment'], { queryParams: { key: 'value' } });
  } 
}


}

