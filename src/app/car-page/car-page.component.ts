// car-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../car.service';
import { CommonModule } from '@angular/common';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-car-page',
  templateUrl: './car-page.component.html',
  styleUrls: ['./car-page.component.css'],
  imports: [CommonModule],
})
export class CarPageComponent implements OnInit {
  car: Car | null=null;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carService.getCarById(+id).subscribe(car => {
        this.car = car;
      });
    }
  }

  rentCar(): void {
    if (this.car) {
      console.log(`Renting car: ${this.car.brand} ${this.car.model}`);
      alert(`შენ იქირავე "${this.car.brand} ${this.car.model}" ${this.car.price * this.car.multiplier}₾-ად დღეში`);
    }
  }
}