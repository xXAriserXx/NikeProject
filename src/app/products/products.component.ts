import { switchMap, map } from 'rxjs';
import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { CommonModule } from '@angular/common';
import { IFilterParams } from '../../../server/models/IFilterParams';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FilterComponent, HeaderComponent, FooterComponent, EuroPipe, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(private productservice:ProductService, private route:ActivatedRoute) {
  }

  allShoes:IShoe[] = []
  searchTerm:string = ""
  page = 1
  limit = 15
  loading = false
  query = ""
  filter:IFilterParams = {price : [], color: [], category: []}

  ngOnInit() {
    window.scroll(0, 0)
    this.route.queryParamMap.pipe(
      switchMap((params: Params) => {
        this.query = params.get("name");
        console.log("risultati per:" + this.query)
        if (this.query !== "") {
          return this.productservice.getShoesPG(this.page, this.limit, this.query)
        } else {
          return this.productservice.getShoesPG(this.page, this.limit)
        }
      })).subscribe({
      next: (shoes: IShoe[]) => {
        this.allShoes = shoes;
        this.page++
      },
      error: (error) => { console.log(error); },
      complete: () => { console.log("All shoes were retrieved"); }
    });



    /*
    this.productservice.getAllShoes().subscribe({
      next: (shoes: IShoe[]) => {
        this.allShoes = shoes;
      },
      error: (error) => { console.log(error); },
      complete: () => { console.log("All shoes were retrieved"); }
    }); */
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
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !this.loading && window.scrollY > 100) {
        this.loadItems();
    }   
  }  

}
