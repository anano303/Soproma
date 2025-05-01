import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { FormPageComponent } from './forms/form-page/form-page.component';
import { LoginComponent } from './forms/login/login.component';
import { CarPageComponent } from './car-page/car-page.component';
import { AddCarComponent } from './add-car/add-car.component';

export const routes: Routes = [
    {path:'', component: HomePageComponent},
    {path:'register', component: FormPageComponent},
    {path:'login', component: LoginComponent},
    {path:'carPage/:id', component: CarPageComponent},
    {path:'addCar', component: AddCarComponent},
];
