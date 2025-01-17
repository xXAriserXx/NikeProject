import { Component } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private checkLogService:CheckLogService) {}

  isLoggedIn:boolean

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
  }



}
