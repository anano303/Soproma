import { Component } from '@angular/core';
import { CarService } from '../car.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-card',
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {

  Cars: any[] = [];
  editingCarId: number | null = null; 

  constructor(private carService: CarService) {
    this.fetchCars();
  }

  fetchCars() {
    this.carService.getCars().subscribe((data) => {
      this.Cars = data;
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
