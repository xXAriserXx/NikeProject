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
        console.log(data)
      },
      error:() => {},
      complete:() => {}
    })

    this.productService.getNewArrivals().subscribe({
      next:(data:IShoe[]) => {
        this.newArrivals = data
        console.log(data)
      },
      error:() => {},
      complete:() => {}
    })

  }

  onImageLoad(event:Event) {
    const img = event.target as HTMLImageElement
    if (img) {
      img.style.opacity = "1"
    }
  }

sliderMove(input, slider) {
    if (!this.canClick) {
        return;
    }
    this.canClick = false;

    const scrollPercentage = 33; 

    let scrollContainer = null;
    if (slider === "newArrivals") {
        scrollContainer = this.scrollContainer.nativeElement;
    } else if (slider === "bestSellers") {
        scrollContainer = this.scrollContainer2.nativeElement;
    }

    if (scrollContainer) {
        const scrollDistance = (scrollContainer.offsetWidth * scrollPercentage) / 100;

        if (input === "left") {
            scrollContainer.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        } else if (input === "right") {
            scrollContainer.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    }

    setTimeout(() => {
        this.canClick = true;
    }, 200);
}




}
