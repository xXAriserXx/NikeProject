import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs';
import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IShoe } from '../../../server/models/IShoe';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { EuroPipe } from '../pipes/euro.pipe';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    window.scroll(0, 0)
    this.route.queryParamMap.pipe(
      switchMap((params: Params) => {
        const query = params.get("name");
        console.log("risultati per:" + query)
        return this.productservice.getAllShoes().pipe(
          map((shoes: IShoe[]) => {
            if (query) {
              this.searchTerm = query
              shoes = shoes.filter(x => x.nome.toLowerCase().includes(query.toLowerCase()));
            }
            return shoes;
          })
        );
      })
    ).subscribe({
      next: (shoes: IShoe[]) => {
        this.allShoes = shoes;
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


  onFilterChange (filteredShoes) {
    this.allShoes = filteredShoes
  }

}
