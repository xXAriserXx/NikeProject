import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { CheckLogService } from '../services/check-log.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService:UserService, private router:Router, private checkLog:CheckLogService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (data) => {
          const token = (data as { access_token: string }).access_token; 
          const decodedToken: any = jwtDecode(token);
          const id = decodedToken._id; 
          localStorage.setItem("authToken", token)
          this.router.navigate(["/dashboard", id])
        },
        error: (error) => {
          console.log(error)
          alert("Password errata")
        },
        complete: () => {
          console.log("user has logged in")
        }
      })
    }
  }

}