import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CheckLogService } from '../services/check-log.service';
import {jwtDecode} from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor (private checkLogService:CheckLogService, private productService:ProductService) {}

  @ViewChild("scrollContainer") scrollContainer!: ElementRef
  @ViewChild("scrollContainer2") scrollContainer2!: ElementRef
  /*
  @ViewChild("header", { read: ElementRef }) header!: ElementRef;
  @HostListener("window:scroll", ["$event"])

onWindowScroll(event: Event) {
  const currentScrollY = window.scrollY;

  if (currentScrollY > this.lastScrollY) {
    this.header.nativeElement.style.transform = "translateY(-100%)";
    this.header.nativeElement.style.opacity = "0";
    this.header.nativeElement.style.position = "absolute";
  } else {
    this.header.nativeElement.style.transform = "translateY(0)";
    this.header.nativeElement.style.opacity = "1";
    this.header.nativeElement.style.position = "fixed";
  }

  this.lastScrollY = currentScrollY;
}*/


  private canClick = true
  isLoggedIn:boolean = false
  userId:string
  bestSellers:IShoe[]
  newArrivals:IShoe[]


  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()

    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = jwtDecode<{ _id: string }>(token);
      this.userId = payload._id
    }

    this.productService.getBestSellers().subscribe({
      next:(data:IShoe[]) => {
        this.bestSellers = data
        console.log(this.bestSellers)
      },
      error:() => {},
      complete:() => {}
    })

    this.productService.getNewArrivals().subscribe({
      next:(data:IShoe[]) => {
        console.log(data)
        this.newArrivals = data
      },
      error:() => {},
      complete:() => {}
    })

  }

  sliderMove (input, slider) {
    if (!this.canClick) {
      return
    }
    this.canClick = false
    if (input === "left" && slider === "newArrivals") {
      this.scrollContainer.nativeElement.scrollBy({ left: -568, behavior: 'smooth' });
      console.log("slider goes left")
    }
    if (input === "right" && slider === "newArrivals") {
      this.scrollContainer.nativeElement.scrollBy({ left: 568, behavior: 'smooth' });
      console.log("slider goes right")
    }
    if (input === "left" && slider === "bestSellers") {
      this.scrollContainer2.nativeElement.scrollBy({ left: -568, behavior: 'smooth' });
      console.log("slider goes left")
    }
    if (input === "right" && slider === "bestSellers") {
      this.scrollContainer2.nativeElement.scrollBy({ left: 568, behavior: 'smooth' });
      console.log("slider goes right")
    }
    setTimeout(() => {
      this.canClick = true 
    }, 200);
  }




}
