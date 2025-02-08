import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  filterForm: FormGroup;
  priceOptions = [
    { label: '50-100€', value: '50' },
    { label: '100-150€', value: '100' },
    { label: '150€+', value: '150' },
  ];
  colorOptions = ['Bianco', 'Rosso', 'Blu', 'Grigio', 'Nero', 'Arancione', 'Verde', 'Argento'];
  categoryOptions = ['Running', 'Sneakers', 'Basket', 'Training', 'Trail Running'];

  constructor(private fb: FormBuilder, private productService:ProductService) {
    this.filterForm = this.fb.group({
      price: this.fb.array([]),
      color: this.fb.array([]),
      category: this.fb.array([]),
    });
  }

  @Output() filterChange = new EventEmitter<any>()

  get price() {
    return (this.filterForm.get('price') as FormArray);
  }

  get color() {
    return (this.filterForm.get('color') as FormArray);
  }

  get category() {
    return (this.filterForm.get('category') as FormArray);
  }

  ngOnInit() {
    this.initPriceOptions();
    this.initColorOptions();
    this.initCategoryOptions();
    this.filterForm.valueChanges.pipe(
    switchMap(value => {
      const selectedFilters = this.getSelectedFilters(value); 
      return this.productService.getFilteredShoesDB(selectedFilters);       
    })
  ).subscribe((filteredShoes: {shoes, msg}) => {
    console.log(filteredShoes.shoes)
    this.filterChange.emit(filteredShoes.shoes)
  }); 

  }
  
  private initPriceOptions() {
    this.priceOptions.forEach(() => this.price.push(this.fb.control(false)));
  }

  private initColorOptions() {
    this.colorOptions.forEach(() => this.color.push(this.fb.control(false)));
  }

  private initCategoryOptions() {
    this.categoryOptions.forEach(() => this.category.push(this.fb.control(false)));
  }

  private getSelectedFilters(formValue: any) {
    const selectedFilters = {
      price: this.priceOptions.filter((_, index) => formValue.price[index]).map(option => option.value),
      color: this.colorOptions.filter((_, index) => formValue.color[index]).map(option => option),
      category: this.categoryOptions.filter((_, index) => formValue.category[index]).map(option => option),
    };
    return selectedFilters;
  }
}
