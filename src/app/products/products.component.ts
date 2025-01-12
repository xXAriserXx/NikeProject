import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  constructor(private productservice:ProductService) {
  }

  allShoes:IShoe[] = []

  ngOnInit () {
    this.productservice.getAllShoes().subscribe({
      next: (shoes:IShoe[]) => {
        this.allShoes = shoes
      },
      error: (error) => {console.log(error)},
      complete: () => {console.log("All shoes were retrieved")}
    })
  }

  onFilterChange (filteredShoes) {
    this.allShoes = filteredShoes
    console.log("ciao")
  }

}
