import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { IOrder } from '../../../server/models/IOrder';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (private orderService:OrderService) { }

  orders:IOrder
    
  ngOnInit () {
      this.orderService.getOrders().subscribe({
        next: (data:any) => {
          console.log(data)
          this.orders = data.ordersFound
        },
        error: (error) => {console.log(error)},
        complete: () => {}
      })
  }
}
