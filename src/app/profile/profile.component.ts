import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RentalService, CarRental } from '../services/rental.service';
import { Car } from '../models/car.model';
import { RouterModule } from '@angular/router';
import { CarService } from '../car.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userName: string = 'მომხმარებელი';
  user: any;
  rentals: CarRental[] = [];
  favorites: Car[] = [];
  uploadedCars: Car[] = [];

  constructor(
    public userService: UserService,
    private rentalService: RentalService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUserValue;

    this.fetchUserFromApi();

    if (!this.user?.firstName || !this.user?.lastName) {
      this.refreshUserData();
    }

    this.userService.currentUser.subscribe((user) => {
      this.user = user;
      if (user && user.firstName && user.lastName) {
        this.userName = `${user.firstName} ${user.lastName}`;
      } else if (user && user.firstName) {
        this.userName = user.firstName;
      } else if (user && user.phoneNumber) {
        this.userName = user.phoneNumber;
      } else {
        this.userName = 'მომხმარებელი';
      }
    });

    this.rentalService.getRentals().subscribe((rentals) => {
      this.rentals = rentals;
    });

    this.loadFavorites();
    this.loadUploadedCars();
  }

  private fetchUserFromApi(): void {
    if (this.userService.isLoggedIn()) {
      this.userService.getUserDetails().subscribe({
        next: (userData) => {
          console.log('Fetched user data:', userData);
          this.user = userData;
        },
        error: (err) => {
          console.error('Failed to fetch user details:', err);
        },
      });
    }
  }

  private refreshUserData(): void {
    const token = localStorage.getItem('token');
    const userId = this.user?.id || localStorage.getItem('userId');

    if (token) {
      this.userService.getUserDetails().subscribe({
        next: (userData) => {
          this.user = userData;
          localStorage.setItem('currentUser', JSON.stringify(userData));
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    }
  }

  getUserName(): string {
    return this.userName;
  }

  deleteRental(id: string): void {
    this.rentalService.deleteRental(id).subscribe({
      next: () => {
        this.rentals = this.rentals.filter((rental) => rental.id !== id);
      },
      error: (error) => {
        console.error('Error deleting rental:', error);
      },
    });
  }

  loadFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    this.favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  removeFavorite(car: Car) {
    this.favorites = this.favorites.filter((f) => f.id !== car.id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  loadUploadedCars(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.carService.getUserCars(userId).subscribe({
        next: (cars: Car[]) => {
          this.uploadedCars = cars;
        },
        error: (err: Error) => {
          console.error('Error loading uploaded cars:', err);
          this.uploadedCars = [];
        },
      });
    }
  }

  deleteCar(carId: number): void {
    if (confirm('ნამდვილად გსურთ მანქანის წაშლა?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          this.uploadedCars = this.uploadedCars.filter(
            (car) => car.id !== carId
          );
        },
        error: (err: Error) => {
          console.error('Error deleting car:', err);
        },
      });
    }
  }
}
