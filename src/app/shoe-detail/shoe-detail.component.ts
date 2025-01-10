import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { IShoe } from '../../../server/models/IShoe';
import { FilterComponent } from "../filter/filter.component";

@Component({
  selector: 'app-shoe-detail',
  standalone: true,
  imports: [FilterComponent],
  templateUrl: './shoe-detail.component.html',
  styleUrl: './shoe-detail.component.scss'
})
export class ShoeDetailComponent {

constructor (private productService:ProductService, private route: ActivatedRoute) { }

shoe:IShoe = {
  nome:undefined
}

ngOnInit () {
  const id = this.route.snapshot.paramMap.get("id");
  this.productService.getDetailShoe(id).subscribe({
    next:(data:IShoe) => {
      console.log(data)
      this.shoe = data[0]
    },
    error:() => {},
    complete:() => {}
  })
}

}
