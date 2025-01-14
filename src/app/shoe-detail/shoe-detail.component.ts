import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IShoe } from '../../../server/models/IShoe';
import { CartService } from '../services/cart.service';
import { IShoeCart } from '../../../server/models/IShoeCart';
import { FormsModule } from '@angular/forms';
import { CheckLogService } from '../services/check-log.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-shoe-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './shoe-detail.component.html',
  styleUrl: './shoe-detail.component.scss'
})
export class ShoeDetailComponent {

constructor (private productService:ProductService, private route: ActivatedRoute, private cartService: CartService, private checkLogService:CheckLogService, private userService:UserService) { }


shoeCart:IShoeCart = {
  shoeName: undefined,
  shoeId: undefined,
  color: undefined,
  size: undefined,
  quantity: undefined,
  price: undefined
}

shoe:IShoe = {
    nome:undefined,
    categoria:undefined,
    prezzo: undefined,
    taglie_disponibili: undefined,
    colori_disponibili: undefined,
    descrizione: undefined,
    immagini: []
}

userId:string
isLoggedIn:boolean = false
colors:string[]
sizes:number[]
chosenColor:string = ""
chosenSize:string = ""
shoeName:string

ngOnInit () {
  this.checkLogService.checkLoginStatus()
  this.isLoggedIn = this.checkLogService.isLoggedIn()
  if (this.isLoggedIn) {
    this.userId = this.userService.getUserData()._id
    console.log("logged in ")
  } else {
    console.log("not logged in ")
  }


  const id = this.route.snapshot.paramMap.get("id");
  this.productService.getDetailShoe(id).subscribe({
    next:(data:IShoe) => {
      console.log(data)
      this.shoe = data
      this.colors = data.colori_disponibili
      this.sizes = data.taglie_disponibili
      this.shoeName = data.nome
    },
    error:() => {},
    complete:() => {}
  })
}

addToCart () {
  this.shoeCart.shoeName = this.shoeName
  this.shoeCart.color = this.chosenColor
  this.shoeCart.size = +this.chosenSize
  this.shoeCart.shoeId = this.route.snapshot.paramMap.get("id")
  this.shoeCart.quantity = 1
  this.shoeCart.price = this.shoe.prezzo

  alert(`${this.shoeCart.shoeName} aggiunto al carrello`)

  if (this.isLoggedIn) {
    this.cartService.updateQuantity(this.shoeCart, "add").subscribe({
      next: (data) => {console.log(data)},
      error: (error) => {console.log(error)},
      complete: () => {}
    })

    console.log("hello")
  } else {
    const guestCart = JSON.parse(localStorage.getItem("cart") || '{"userId": "guest", "shoes": []}');
    const alreadyPresent:number = guestCart.shoes.findIndex((shoe) => shoe.shoeId === this.shoeCart.shoeId && shoe.color === this.shoeCart.color && shoe.size === this.shoeCart.size)
    if (alreadyPresent !== -1) {
      guestCart.shoes[alreadyPresent].quantity++
    } else {
      guestCart.shoes.push(this.shoeCart)
      console.log(this.shoeCart)
    }
    localStorage.setItem("cart", JSON.stringify(guestCart))
  }
}

}
