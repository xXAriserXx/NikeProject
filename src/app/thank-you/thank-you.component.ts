import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { UserService } from '../services/user.service';
import { CheckLogService } from '../services/check-log.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent {

constructor(private userService:UserService, private checkLog:CheckLogService) {}

userName
loggedIn:boolean = false

ngOnInit () {
  this.checkLog.checkLoginStatus()
  this.loggedIn = this.checkLog.isLoggedIn() 
  if (this.loggedIn) {
    this.userName = this.userService.getUserData().name
  }
}

}
