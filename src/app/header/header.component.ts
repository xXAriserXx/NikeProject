import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { IShoe } from '../../../server/models/IShoe';
import { RouterLink } from '@angular/router';
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

  constructor(private checkLogService: CheckLogService, private userService: UserService, private productService: ProductService, private cartService: CartService) {}

  ngAfterViewInit() {
    this.lastScrollY = 0; 
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: Event) {
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

  getShoeQuantity() {
    if (this.isLoggedIn) {
      this.user = this.userService.getUserData();
      this.cartService.getUserCart(this.user._id).subscribe({
        next: (cart: ICart) => {
          this.quantity = cart.shoes.length;
        },
        error: () => {},
        complete: () => {}
      });
    } else {
      this.quantity = this.cartService.getQuantityGuest();
    }
  }

  onClickSearch() {
    this.searching = true;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 1);
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
    this.searching = false;
  }
} 

