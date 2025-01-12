import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ShoeDetailComponent } from './shoe-detail/shoe-detail.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: "", pathMatch:"full", redirectTo:"home" },
    { path: "home", component: HomeComponent},
    { path: "login", component: LoginComponent},
    { path: "register", component: RegisterComponent},
    { path: "cart/:id", component: CartComponent, canActivate: [authGuard]}, 
    { path: "cart", component: CartComponent},
    { path: "dashboard/:id", component: DashboardComponent, canActivate: [authGuard]}, 
    { path: "products", component:  ProductsComponent},
    { path: "shoeDetail/:id", component: ShoeDetailComponent}, 
];
