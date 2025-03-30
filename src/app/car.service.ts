import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  imageUrl1: string;
  transmission: string;
  capacity: number;
  fuelCapacity: number;
  price: number;
  multiplier: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // private apiUrl = 'https://rentcar.stepprojects.ge/swagger/v1/swagger.json'; 

  // constructor(private http: HttpClient) {}

  // getCars(): Observable<Car[]> {
  //   return this.http.get<Car[]>(this.apiUrl);
  // }

  // getCarById(id: number): Observable<Car> {
  //   return this.http.get<Car>(`${this.apiUrl}/${id}`);
  // }

  // addCar(car: Car): Observable<Car> {
  //   return this.http.post<Car>(this.apiUrl, car);
  // }

  // updateCar(id: number, car: Car): Observable<Car> {
  //   return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  // }

  // deleteCar(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
  
  private apiUrl = 'https://rentcar.stepprojects.ge/api/Car';

  constructor(private http: HttpClient) {}
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCar(Car: { name: string; email: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, Car);
  }
  updateCar(id: number, updateCar: { name: string }): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/' + id, updateCar);
  }
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }

}