import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RentalService, CarRental } from '../services/rental.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userName: string = 'მომხმარებელი';
  user: any;
  rentals: CarRental[] = [];

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
}
