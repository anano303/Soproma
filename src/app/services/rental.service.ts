import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CarRental {
  car: {
    brand: string;
    model: string;
    city: string;
    imageUrl1: string;
  };
  totalPrice: number;
  days: number;
  startDate: Date;
  endDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private rentals = new BehaviorSubject<CarRental[]>(this.loadRentals());

  private loadRentals(): CarRental[] {
    const saved = localStorage.getItem('rentals');
    return saved ? JSON.parse(saved) : [];
  }

  private saveRentals(rentals: CarRental[]) {
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }

  addRental(rental: CarRental) {
    const currentRentals = this.rentals.value;
    const newRentals = [...currentRentals, rental];
    this.saveRentals(newRentals);
    this.rentals.next(newRentals);
  }

  getRentals() {
    return this.rentals.asObservable();
  }
}
