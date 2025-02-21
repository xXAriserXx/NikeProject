import { Component, EventEmitter, Output } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  constructor (private checkLogService:CheckLogService, private cartService:CartService, private userService:UserService, private router:Router) {}

  @Input() shoeData:IShoeCart = undefined
  @Input() shoeImage:IShoeCart = undefined
  @Input() message: string = ""
  @Output () closeEvent = new EventEmitter()
  isLoggedIn:boolean
  quantity:number
  userId:string

  ngOnInit () {
    console.log(this.message)
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
    console.log(this.shoeImage)

    if (this.isLoggedIn) {
      this.cartService.getQuantityUser().subscribe({
        next: (data:number) => {
          this.quantity = data
        }
      })
    } else {
      this.quantity = this.cartService.getQuantityGuest() - 1
    }
  }

  pay () {
    this.router.navigate(['/payment'], {state: { discount: [ 0 , 0] }})
  }

  ngOnDestroy () {
    document.body.style.overflow = "auto"
  }

  close () {
    this.closeEvent.emit("")

  }
}
