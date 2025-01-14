import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { IOrder } from '../../../server/models/IOrder';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (private orderService:OrderService, private userService:UserService, private router:Router) { }

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

  logOut () {
    this.userService.logOut()
    this.router.navigate(['/home'])
  }
}
