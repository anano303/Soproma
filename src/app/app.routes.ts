import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CarPageComponent } from './car-page/car-page.component';
import { AddCarComponent } from './add-car/add-car.component';
import { FormPageComponent } from './forms/form-page/form-page.component';
import { LoginComponent } from './forms/login/login.component';
import { RegisterComponent } from './forms/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'car/:id', component: CarPageComponent },
  {
    path: 'addCar',
    component: AddCarComponent,
    canActivate: [AuthGuard], // Protect this route with AuthGuard
  },
  { path: 'form', component: FormPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }, // Redirect to home for any unknown paths
];
