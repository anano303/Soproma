import { Component, Input } from '@angular/core';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  image1: string;
  image2: string;
  image3: string;
  price: number;
  multiplier: number;
  capacity: number;
  transmission: string;
  createdBy: string;
  createdByEmail: string;
  fuelCapacity: number;
  city: string;
  latitude: number;
  longitude: number;
  ownerPhoneNumber: string;
}

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
}
