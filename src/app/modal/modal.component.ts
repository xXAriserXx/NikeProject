import { Component, EventEmitter, Output } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICart } from '../../../server/models/ICart';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService) {}

  @Input() shoeData:IShoeCart
  @Input() shoeImage:IShoeCart
  @Output () closeEvent = new EventEmitter()
  isLoggedIn:boolean
  quantity:number
  userId:string

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
    console.log(this.shoeImage)

    if (this.isLoggedIn) {
      this.userId = this.userService.getUserData()._id
      this.cartService.getQuantityUser(this.userId).subscribe({
        next: (quantity:number) => {
          this.quantity = quantity
        },
        error: () => {},
        complete: () => {}
      })
    } else {
      this.quantity = this.cartService.getQuantityGuest()
    }

  }

  ngOnDestroy () {
    document.body.style.overflow = "auto"
  }

  close () {
    this.closeEvent.emit("")

  }
}
