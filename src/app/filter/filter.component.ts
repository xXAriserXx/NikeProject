import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  filterForm:FormGroup

  constructor(private fb:FormBuilder) {
    this.filterForm = this.fb.group({
      price: this.fb.array([]),
      color: this.fb.array([]),
      category: this.fb.array([])
  })
  }

}
