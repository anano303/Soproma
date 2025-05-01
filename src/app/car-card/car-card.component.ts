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
}
