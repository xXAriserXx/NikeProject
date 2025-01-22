import { Component } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private checkLogService:CheckLogService) {}

  isLoggedIn:boolean
  searching:boolean = false

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
  }

  onClickSearch () {
    this.searching = true
    document.body.style.overflow = "hidden"
  }

  



}
