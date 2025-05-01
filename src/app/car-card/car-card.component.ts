import { Component } from '@angular/core';
import { CarService } from '../car.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-car-card',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css',
})
export class CarCardComponent {
  Cars: Car[] = [];
  editingCarId: number | null = null;

  constructor(private carService: CarService) {
    this.fetchCars();
  }

  ngOnInit(): void {
    this.carService.getCars().subscribe((response) => {
      this.Cars = response.data; // Access the 'data' property which contains the Car array
    });
  }

  fetchCars() {
    this.carService.getCars().subscribe((response) => {
      this.Cars = response.data; // Fix: properly access the data array from the paginated response
    });
  }

  editCar(car: any) {
    this.editingCarId = car.id;
  }

  deleteCar(id: number) {
    this.carService.deleteCar(id).subscribe(() => {
      console.log('Car deleted');
      this.Cars = this.Cars.filter((car) => car.id !== id);
    });
  }

  resetForm() {
    this.editingCarId = null;
  }

  calculatePrice(car: Car): number {
    // Ensure we have numeric values for calculation
    const price =
      typeof car.price === 'number'
        ? car.price
        : parseFloat(car.price as any) || 0;
    const multiplier =
      typeof car.multiplier === 'number'
        ? car.multiplier
        : parseFloat(car.multiplier as any) || 1;

    // Always use at least 1 as multiplier
    const effectiveMultiplier = Math.max(multiplier, 1);

    return price * effectiveMultiplier;
  }
}
