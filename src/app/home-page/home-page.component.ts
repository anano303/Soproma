// import { CommonModule } from '@angular/common';
// import { Component} from '@angular/core';
// import { CarCardComponent } from '../car-card/car-card.component';
// import { CarService } from '../car.service';
// import { Car } from '../models/car.model';
// import { FormsModule, NgModel } from '@angular/forms';


// @Component({
//   selector: 'app-home-page',
//   imports: [CommonModule,CarCardComponent,FormsModule],
//   templateUrl: './home-page.component.html',
//   styleUrl: './home-page.component.css'
// })
// export class HomePageComponent {
//   searchTerm: string = '';
//   allCars: Car[] = [];
//   filteredCars: Car[] = [];

//   constructor(private carService: CarService) {}

//   ngOnInit(): void {
//     this.carService.getCars().subscribe(cars => {
//       this.allCars = cars;
//       this.filteredCars = [...this.allCars];
//     });
//   }

//   searchCars(): void {
//     if (!this.searchTerm) {
//       this.filteredCars = [...this.allCars];
//       return;
//     }

//     this.filteredCars = this.allCars.filter(car =>
//       car.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       car.model.toLowerCase().includes(this.searchTerm.toLowerCase())
//     );
//   }


// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCardComponent } from '../car-card/car-card.component';
import { FormsModule } from '@angular/forms';
import { CarService } from '../car.service';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CarCardComponent, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  searchTerm: string = '';
  allCars: Car[] = [];
  filteredCars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        console.log('API-დან მიღებული მონაცემები:', cars);
        this.allCars = cars || [];
        this.filteredCars = [...this.allCars];
      },
      error: (err) => {
        console.error('შეცდომა მონაცემების ჩატვირთვისას:', err);
        this.allCars = [];
        this.filteredCars = [];
      }
    });
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.allCars = cars;
        this.filteredCars = [...cars];
        console.log('მანქანები ჩაიტვირთა:', cars); // დამატებითი ლოგირება
      },
      error: (err) => {
        console.error('შეცდომა მანქანების ჩატვირთვისას:', err);
      }
    });
  }

  searchCars(): void {
    console.log('ძებნის ტერმინი:', this.searchTerm);
    console.log('ყველა მანქანა:', this.allCars);
  
    if (!this.searchTerm?.trim()) {
      this.filteredCars = [...this.allCars];
      console.log('ფილტრი არ არის გამოყენებული, ყველა მანქანა:', this.filteredCars);
      return;
    }
  
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCars = this.allCars.filter(car => {
      const brandMatch = car.brand?.toLowerCase().includes(term) ?? false;
      const modelMatch = car.model?.toLowerCase().includes(term) ?? false;
      return brandMatch || modelMatch;
    });
  
    console.log('გაფილტრული მანქანები:', this.filteredCars);
  }
}