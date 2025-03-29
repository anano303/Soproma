import { Component, Input } from '@angular/core';
import { CarService } from '../car.service';

@Component({
  selector: 'app-car-card',
  imports: [],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {

  @Input() car: Car = {
    id: 0,
    brand: 'Brand',
    model: 'Model',
    year: 2023,
    imageUrl1: 'assets/car-image.jpg',
    imageUrl2: '',
    imageUrl3: '',
    image1: '',
    image2: '',
    image3: '',
    price: 100,
    multiplier: 1,
    capacity: 5,
    transmission: 'Automatic',
    createdBy: '',
    createdByEmail: '',
    fuelCapacity: 50,
    city: 'City',
    latitude: 0,
    longitude: 0,
    ownerPhoneNumber: ''
  };

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
