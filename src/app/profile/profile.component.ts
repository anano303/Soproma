import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RentalService, CarRental } from '../services/rental.service';
import { Car } from '../models/car.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userName: string = 'მომხმარებელი';
  user: any;
  rentals: CarRental[] = [];
  favorites: Car[] = [];

  constructor(
    public userService: UserService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
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

    this.rentalService.getRentals().subscribe(rentals => {
      this.rentals = rentals;
    });

    this.loadFavorites();
  }

  getUserName(): string {
    return this.userName;
  }

  deleteRental(id: string): void {
    this.rentalService.deleteRental(id).subscribe({
      next: () => {
        this.rentals = this.rentals.filter(rental => rental.id !== id);
      },
      error: (error) => {
        console.error('Error deleting rental:', error);
      }
    });
  }

  loadFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    this.favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  removeFavorite(car: Car) {
    this.favorites = this.favorites.filter(f => f.id !== car.id);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}
