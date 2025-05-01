import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from './models/car.model';
import { CarPaginatedData } from './models/carPaginatedData.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'https://rentcar.stepprojects.ge/api';

  constructor(private http: HttpClient) {}

  getCars(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<CarPaginatedData> {
    console.log(`Requesting page ${pageIndex} with size ${pageSize}`);
    return this.http.get<CarPaginatedData>(
      `${this.apiUrl}/Car/paginated?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/Car/${id}`);
  }

  addCar(carData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cars`, carData);
  }

  updateCar(id: number, updateCar: { name: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cars/${id}`, updateCar);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cars/${id}`);
  }

  uploadCarImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(`${this.apiUrl}/cars/upload`, formData);
  }
}
