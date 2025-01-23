import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IShoe } from '../../../server/models/IShoe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  constructor (private productService:ProductService) { }

  userInput:string
  shoes:IShoe[] = []

  @Output() closeEvent = new EventEmitter<void>()
  @ViewChild("searchInput") searchInput: ElementRef

  ngAfterViewInit () {
    this.searchInput.nativeElement.focus()
  }

  close () {
    this.closeEvent.emit()
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



}
