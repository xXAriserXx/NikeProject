import { Component } from '@angular/core';
import { CheckLogService } from '../services/check-log.service';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../../../server/models/IUser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private checkLogService:CheckLogService, private userService:UserService) {}

  isLoggedIn:boolean
  searching:boolean = false
  user:IUser

  ngOnInit () {
    this.checkLogService.checkLoginStatus()
    this.isLoggedIn = this.checkLogService.isLoggedIn()
    this.user = this.userService.getUserData()
  }

  onClickSearch () {
    this.searching = true
    document.body.style.overflow = "hidden"
  }

  



}
