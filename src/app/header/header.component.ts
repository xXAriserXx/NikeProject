import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { IShoe } from '../../../server/models/IShoe';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../../../server/models/IUser';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private checkLogService:CheckLogService, private userService:UserService, private productService:ProductService) {}


  @ViewChild("header", { read: ElementRef }) header!: ElementRef;
  @ViewChild("searchInput") searchInput!: ElementRef
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: Event) {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.lastScrollY) {
      this.header.nativeElement.style.transform = "translateY(-100%)";
    } else {
      this.header.nativeElement.style.transform = "translateY(0)";
      this.header.nativeElement.style.position = "fixed";
    }

    this.lastScrollY = currentScrollY;
  }
  
  lastScrollY:number
  isLoggedIn:boolean
  searching:boolean = false
  user:IUser
  userInput:string
  shoes:IShoe[] = []

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
    this.user = this.userService.getUserData()
    console.log(this.user)
  }


  onClickSearch () {
    this.searching = true
    document.body.style.overflow = "hidden"
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    }, 1);
  }

  onSearch () {
    this.productService.getShoesByName(this.userInput).subscribe({
      next: (data:IShoe[]) => {
        console.log(data)
        this.shoes = data
      },
      error: (error) => {console.log(error)},
      complete: () => {}
    })
  }

  close () {
    this.searching = false
    document.body.style.overflow = "auto"
  }

}

