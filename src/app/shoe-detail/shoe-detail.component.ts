import { Component, ViewChild } from '@angular/core';
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
import { ModalComponent } from "../modal/modal.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { FavoritesService } from '../services/favorites.service';
import { IShoeFav } from '../../../server/models/IShoeFav';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shoe-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, HeaderComponent, FooterComponent, ModalComponent, EuroPipe],
  templateUrl: './shoe-detail.component.html',
  styleUrl: './shoe-detail.component.scss'
})
export class ShoeDetailComponent {

constructor (private productService:ProductService, private route: ActivatedRoute, private cartService: CartService, private checkLogService:CheckLogService, private userService:UserService, private favoritesService:FavoritesService) {}
@ViewChild(HeaderComponent) headerComponent: HeaderComponent;

shoeCart:IShoeCart = {
  shoeName: undefined,
  shoeId: undefined,
  color: undefined,
  size: undefined,
  quantity: undefined,
  price: undefined,
  imageIcon: undefined
}

shoeFavorite:IShoeFav = {
  shoeName: undefined,
  shoeId: undefined,
  imageIcon: undefined
}

shoe:IShoe = {
    nome:undefined,
    categoria:undefined,
    prezzo: 0,
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
modalActive:boolean = false
currentImage:number = 2
error:boolean = false

ngOnInit () {
  window.scrollTo(0, 0)
  this.checkLogService.checkLoginStatus()
  this.isLoggedIn = this.checkLogService.isLoggedIn()
  this.getRandomShoes()
  if (this.isLoggedIn) {
    this.userId = this.userService.getUserData()._id
  } else {
  }

  const id = this.route.snapshot.paramMap.get("id");
  this.productService.getDetailShoe(id).subscribe({
    next:(data:IShoe) => {
      this.shoe = data
      this.colors = data.colori_disponibili
      this.sizes = data.taglie_disponibili
      this.shoeName = data.nome
      this.chosenColor = this.colors[0]
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
  this.shoeCart.imageIcon = this.shoe.immagini[0]

  if (this.chosenSize == "") {
    this.error = true
    return
  }

  this.error = false

  if (this.isLoggedIn) {
    this.cartService.updateQuantity(this.shoeCart, "add").subscribe({
      next: (data) => {
        this.headerComponent.getShoeQuantity()
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })

  } else {
    const guestCart = JSON.parse(localStorage.getItem("cart") || '{"userId": "guest", "shoes": []}');
    const alreadyPresent:number = guestCart.shoes.findIndex((shoe) => shoe.shoeId === this.shoeCart.shoeId && shoe.color === this.shoeCart.color && shoe.size === this.shoeCart.size)
    if (alreadyPresent !== -1) {
      guestCart.shoes[alreadyPresent].quantity++
    } else {
      guestCart.shoes.push(this.shoeCart)
    }
    localStorage.setItem("cart", JSON.stringify(guestCart))
    this.headerComponent.getShoeQuantity()
  }
  this.modalActive = true
  document.body.style.overflow = "hidden"
  window.scroll(0, 0)
  setTimeout(() => {
    this.modalActive = false 
    document.body.style.overflow = "auto"
  }, 50000);
}

addToFavorites () {
  if (this.isLoggedIn) {
    this.shoeFavorite.shoeName = this.shoeName
    this.shoeFavorite.shoeId = this.route.snapshot.paramMap.get("id")
    this.shoeFavorite.imageIcon = this.shoe.immagini[0]
    this.favoritesService.addFavorite(this.shoeFavorite).subscribe({
      next: (data) => {
        alert("Aggiunto ai preferiti")
      },
      error: (error:HttpErrorResponse) => {alert(error.error.msg)},
      complete: ()=> {}
    })
  } else {
    alert("Devi essere loggato per aggiungere ai preferiti")
  }
}

onImageLoad (event:Event) {
  const img = event.target as HTMLImageElement
  if (img) {
    img.style.opacity = "1"
  }
}

isImage(url: string): boolean {
  return /\.(jpg|jpeg|png)$/i.test(url);
}

isVideo(url: string): boolean {
  return /\.(mp4|mov)$/i.test(url);
}

closeModal () {
  this.modalActive = false
  document.body.style.overflow = "auto"
}

hoverImage (i) {
  this.currentImage = i + 1
}

getRandomShoes () {
  this.productService.getRandomShoes().subscribe({
    next: (randomShoes:IShoe) => {
    },
    error: (error) => {console.log(error)},
    complete: () => {}

  })
}

rightImage () {
  this.currentImage = this.currentImage + 2
  if (this.currentImage > this.shoe.immagini.length) {
    this.currentImage = 2
  }
}

leftImage () {
  this.currentImage = this.currentImage - 2
  if (this.currentImage === 0) {
    this.currentImage = this.shoe.immagini.length - 1
  }
}

}
