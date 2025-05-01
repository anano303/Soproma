import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../car.service';
import { CommonModule } from '@angular/common';
import { Car } from '../models/car.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-page',
  templateUrl: './car-page.component.html',
  styleUrls: ['./car-page.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CarPageComponent implements OnInit {
  car: Car | null = null;
  rentalDays: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private route: ActivatedRoute, private carService: CarService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carService.getCarById(+id).subscribe((car) => {
        this.car = car;
      });
    }

    // Load cars with pagination
    this.loadCarsWithPagination();
  }

  loadCarsWithPagination(pageIndex: number = 1): void {
    this.pageIndex = pageIndex;
    this.carService
      .getCars(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        // Store the paginated data
        this.totalPages = response.totalPages;
        // You can store the cars list if needed like:
        // this.carsList = response.data;
      });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.loadCarsWithPagination(newPage);
    }
  }

  calculateTotalPrice(): number {
    if (this.car) {
      return this.car.price * this.car.multiplier * this.rentalDays;
    }
    return 0;
  }

  rentCar(): void {
    if (this.car) {
      const totalPrice = this.calculateTotalPrice();
      console.log(
        `Renting car: ${this.car.brand} ${this.car.model} for ${this.rentalDays} days`
      );
      alert(
        `შენ იქირავე "${this.car.brand} ${this.car.model}" ${this.rentalDays} დღით, ჯამური ფასი: ${totalPrice}₾`
      );
    }
  }
}
