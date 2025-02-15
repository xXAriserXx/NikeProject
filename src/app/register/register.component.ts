import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
form: FormGroup;

  constructor(private fb: FormBuilder, private usersService:UserService, private router:Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.usersService.register(this.form.value).subscribe({
        next: (data) => {console.log(data)},
        error: (error:HttpErrorResponse) => {
          alert(error.error.msg)
        },
        complete: () => {
          alert("User has been registered")
          this.router.navigate(['/login'])
        }
      })
    }
  }
}