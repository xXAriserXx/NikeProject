import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { ICart } from '../../../server/models/ICart';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CheckLogService } from '../services/check-log.service';
import { EuroPipe } from '../pipes/euro.pipe';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ReactiveFormsModule, EuroPipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  form:FormGroup
  constructor (private cartService:CartService, private userService:UserService, private router:Router, private orderService:OrderService, private fb: FormBuilder, private checkLogService:CheckLogService) {

this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cardDetails: this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expireDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
      })
    });
  }
  

  userId:string
  cart:ICart = {userId: undefined, shoes: []}
  order:IShoeCart[]
  isLoggedIn:boolean
  discount?:number = 0
  total: number

  ngOnInit () {
    window.scroll(0, 0)
    this.discount = history.state.discount[0] - history.state.discount[1]
    this.total = history.state.discount[0] - (history.state.discount[0]  - history.state.discount[1])

    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()

    if (this.isLoggedIn) {
      this.userId = this.userService.getUserData()._id
      this.cartService.getUserCart(this.userId).subscribe({
        next: (data:ICart) => {
          if (this.total == 0) {
            this.calcTotPrice(data)
          }
          console.log(data)
          this.cart = data
          this.order = data.shoes
        },
        error: (error) => {console.log(error)},
        complete: () => {}
      })
    } else {
      this.cart = this.cartService.getGuestCart()
      this.calcTotPrice(this.cart)
    }
  }

  calcTotPrice(cart: ICart) {
    if (cart.shoes.length > 0) {
      this.total = +cart.shoes.map(item => item.price * item.quantity).reduce((acc, price) => acc + price, 0).toFixed(2);
    } 
  }

  onSubmit () {
    console.log(this.order)
    this.orderService.createOrder(this.order, this.total, this.discount).subscribe({
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
