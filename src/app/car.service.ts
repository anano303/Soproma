import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,empty } from 'rxjs';
import { Car } from './models/car.model';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'https://rentcar.stepprojects.ge/api/Car';

  constructor(private http: HttpClient) {}
  // getCars(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('API შეცდომა:', err);
        return empty(); 
      })
    );
  }


  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // addCar(Car: { name: string; email: string }): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, Car);
  // }
 
  addCar(carData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, carData);
  }
  updateCar(id: number, updateCar: { name: string }): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/' + id, updateCar);
  }
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }

  uploadCarImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

}