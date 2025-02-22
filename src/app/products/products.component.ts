import { switchMap } from 'rxjs';
import { Component, ElementRef, HostListener, input, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { CommonModule } from '@angular/common';
import { IFilterParams } from '../../../server/models/IFilterParams';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FilterComponent, HeaderComponent, FooterComponent, EuroPipe, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(private productservice:ProductService, private route:ActivatedRoute, private windowService:WindowService) {
  }

  @ViewChild("scrollTrigger") scrollTrigger!: ElementRef
  @ViewChild("appFilter", { read: ElementRef }) appFilter!: ElementRef
  @ViewChild("inputFilter", { read: ElementRef }) inputFilter!: HTMLInputElement

  @HostListener("window:resize", ['$event'])
  onResize(event:Event) {
    if (this.windowService.nativeWindow.innerWidth <= 560) {
      this.filterMsg = "Mostra filtri"
      
    } 
    else if (this.filterMsg == "Mostra filtri" && this.checkedInput == false) {
      this.filterMsg = "Nascondi filtri"
    } 
    if (this.windowService.nativeWindow.innerWidth <= 560 && this.checkedInput) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  allShoes:IShoe[] = []
  searchTerm:string = ""
  page = 1
  limit = 15
  loading = false
  query = ""
  filter:IFilterParams = {price : [], color: [], category: []}
  filterMsg: string = "Nascondi filtri"
  checkedInput: boolean = false

  ngOnInit() {
    this.onResize(new Event ("resize"))
    window.scroll(0, 0)

    this.route.queryParamMap.pipe(
      switchMap((params: Params) => {
        this.query = params.get("name");
        this.searchTerm = this.query
        if (this.query !== "") {
          return this.productservice.getShoesPG(this.page, this.limit, this.query)
        } else {
          return this.productservice.getShoesPG(this.page, this.limit)
        }
      })).subscribe({
      next: (shoes: IShoe[]) => {
        this.allShoes = shoes;
        console.log("increased page")
      },
      error: (error) => { console.log(error); },
      complete: () => { console.log("All shoes were retrieved"); }
    });
  }

  ngAfterViewInit () {
    this.setupIntersectionObserver()
  }

  onImageLoad (event:Event) {
    const img = event.target as HTMLImageElement
    if (img) {
      img.style.opacity = "1"
    }
  }

  onFilterChange (filter): void {
    this.filter = filter
    this.page = 1
    this.productservice.getShoesPG(this.page, this.limit, this.query, this.filter).subscribe({
      next: (data:IShoe[]) => {
        this.allShoes = data
      }
    })
  }

  loadItems(): void {
    this.loading = true
    this.page++
    this.productservice.getShoesPG(this.page, this.limit, this.query, this.filter).subscribe({
      next: (data:IShoe[]) => {
        this.allShoes = [ ...this.allShoes, ...data]
        this.loading = false
      },
      error: (e) => {
        console.error("Error loading items", e)
        this.loading = false
      }
    })
  }

  setupIntersectionObserver () {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    }

    let hasScrolled = false

    const startObserving = () => {
      if (hasScrolled && this.scrollTrigger) {
        observer.observe(this.scrollTrigger.nativeElement)
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.loading) {
          this.loadItems() 
        }
      })
    }, options)

    const handleScroll = () => {
      hasScrolled = true
      startObserving()
    }

    window.addEventListener("scroll", handleScroll)

  }

  changeFilterMsg () {
    if (this.filterMsg === "Mostra filtri") {
      this.filterMsg = "Nascondi filtri"
    } else {
      this.filterMsg = "Mostra filtri"
    }
  }

  check (event:Event) {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      this.checkedInput = true
    } else {
      this.checkedInput = false
    }

    this.onResize(new Event ("resize"))
  }

}
