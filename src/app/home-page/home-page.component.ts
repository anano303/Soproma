import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../car.service';
import { Car } from '../models/car.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  searchTerm: string = '';
  allCars: Car[] = [];
  filteredCars: Car[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  constructor(
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get page from URL if present
    this.route.queryParams.subscribe((params) => {
      const page = params['page'];
      this.currentPage = page ? parseInt(page) : 1;
      this.loadCarsPage(this.currentPage);
    });
  }

  loadCarsPage(page: number): void {
    this.carService.getCars(page, this.pageSize).subscribe({
      next: (response) => {
        console.log('API-დან მიღებული მონაცემები:', response);
        this.allCars = response.data || [];
        this.filteredCars = [...this.allCars];
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        // Update URL with current page
        this.updateUrlWithPage(this.currentPage);
      },
      error: (err) => {
        console.error('შეცდომა მონაცემების ჩატვირთვისას:', err);
        this.allCars = [];
        this.filteredCars = [];
      },
    });
  }

  updateUrlWithPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadCarsPage(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  searchCars(): void {
    console.log('ძებნის ტერმინი:', this.searchTerm);

    if (!this.searchTerm?.trim()) {
      this.loadCarsPage(1); // Reset to first page with all cars
      return;
    }

    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCars = this.allCars.filter((car) => {
      const brandMatch = car.brand?.toLowerCase().includes(term) ?? false;
      const modelMatch = car.model?.toLowerCase().includes(term) ?? false;
      return brandMatch || modelMatch;
    });

    console.log('გაფილტრული მანქანები:', this.filteredCars);
  }
}
