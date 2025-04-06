import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'https://rentcar.stepprojects.ge/api/Car';

  constructor(private http: HttpClient) {}
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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