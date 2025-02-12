import { Component, ElementRef, HostListener, viewChild, ViewChild } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { IShoe } from '../../../server/models/IShoe';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../../../server/models/IUser';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ICart } from '../../../server/models/ICart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @ViewChild("overlay3") overlay3!: ElementRef
  @ViewChild("barraHamburger") barraHamburger!: ElementRef;
  @ViewChild("header", { read: ElementRef }) header!: ElementRef;
  @ViewChild("searchInput") searchInput!: ElementRef;

  lastScrollY: number;
  isLoggedIn: boolean;
  searching: boolean = false;
  user: IUser;
  userId: string;
  userInput: string;
  shoes: IShoe[] = [];
  quantity: number = 0;

  constructor(private checkLogService: CheckLogService, private userService: UserService, private productService: ProductService, private cartService: CartService, private router:Router) {}

  ngAfterViewInit() {
    this.lastScrollY = 0; 
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (this.header) {
      const currentScrollY = window.scrollY;
      if (currentScrollY > this.lastScrollY) {
        this.header.nativeElement.style.transform = "translateY(-100%)";
      } else {
        this.header.nativeElement.style.transform = "translateY(0)";
        this.header.nativeElement.style.position = "fixed";
      }

      this.lastScrollY = currentScrollY;
    }
  }

  ngOnInit() {
    this.checkLogService.checkLoginStatus();
    this.isLoggedIn = this.checkLogService.isLoggedIn();
    this.getShoeQuantity();
  }

  ngOnDestroy () {
    document.body.style.overflow = "auto"
  }

  getShoeQuantity() {
    if (this.isLoggedIn) {
      this.user = this.userService.getUserData();
      this.cartService.getQuantityUser().subscribe({
        next: (data:number) => {
          this.quantity = data;
        },
        error: () => {},
        complete: () => {}
      });
    } else {
      this.quantity = this.cartService.getQuantityGuest();
    }
  }

  onClickSearch () {
    this.searching = true;
    document.body.style.overflow = "hidden"
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 1);
  }

  onEnter() {
    this.router.navigate(['/products'], {queryParams: { name: this.userInput }})
    this.searching = false
    document.body.style.overflow = "auto"
  }

  onSearch() {
    this.productService.getShoesByName(this.userInput).subscribe({
      next: (data: IShoe[]) => {
        this.shoes = data;
      },
      error: (error) => { console.log(error); },
      complete: () => {}
    });
  }

  close() {
    document.body.style.overflow = "auto" 
    this.searching = false;
    /*
    setTimeout(() => {
      
    window.location.reload()
    }, 200);
    */
  }

  closeHamburger () {
    this.barraHamburger.nativeElement.style.visibility = "hidden"
    this.overlay3.nativeElement.style.display = "none"
    document.body.style.overflow = "auto"
  }

  openHamburger () {
    this.barraHamburger.nativeElement.style.visibility = "visible"
    this.overlay3.nativeElement.style.display = "block"
    document.body.style.overflow = "hidden"
  }

} 

