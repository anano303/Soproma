import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../car.service';
import { Car } from '../models/car.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CarFilter } from '../models/carFilter.model';

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
  pageSize: number = 12;
  totalPages: number = 1;
  totalItems: number = 0;

  // Filter options
  filter: CarFilter = {
    pageIndex: 1,
    pageSize: 10,
  };

  // Available cities for dropdown
  cities: string[] = [];

  // Years range for filtering
  years: number[] = [];
  currentYear = new Date().getFullYear();

  // Capacities for filtering
  capacities: number[] = [2, 4, 5, 6, 7, 8];

  // To track if filters are applied
  filtersApplied = false;

  constructor(
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Generate years array (from 1990 to current year)
    this.years = Array.from(
      { length: this.currentYear - 1989 },
      (_, i) => 1990 + i
    );
  }

  ngOnInit(): void {
    // Load available cities
    this.loadCities();

    // Get filters and page from URL if present
    this.route.queryParams.subscribe((params) => {
      this.filter.pageIndex = params['page'] ? parseInt(params['page']) : 1;
      this.filter.capacity = params['capacity']
        ? parseInt(params['capacity'])
        : undefined;
      this.filter.startYear = params['startYear']
        ? parseInt(params['startYear'])
        : undefined;
      this.filter.endYear = params['endYear']
        ? parseInt(params['endYear'])
        : undefined;
      this.filter.city = params['city'] || undefined;

      this.currentPage = this.filter.pageIndex;

      // Determine if we should use filter or just load cars
      if (this.hasActiveFilters()) {
        this.filtersApplied = true;
        this.filterCars();
      } else {
        this.loadCarsPage(this.currentPage);
      }
    });
  }

  loadCities(): void {
    this.carService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error('Error loading cities:', err);
      },
    });
  }

  loadCarsPage(page: number): void {
    this.filter.pageIndex = page;
    this.currentPage = page;

    // If filters are applied, use filterCars method instead
    if (this.filtersApplied) {
      this.filterCars();
      return;
    }

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

  filterCars(): void {
    this.carService.filterCars(this.filter).subscribe({
      next: (response) => {
        console.log('გაფილტრული მონაცემები:', response);
        this.allCars = response.data || [];
        this.filteredCars = [...this.allCars];
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.currentPage;
        // Update URL with filter parameters
        this.updateUrlWithFilters();
      },
      error: (err) => {
        console.error('შეცდომა ფილტრაციისას:', err);
        this.allCars = [];
        this.filteredCars = [];
      },
    });
  }

  applyFilters(): void {
    this.filtersApplied = this.hasActiveFilters();
    this.filter.pageIndex = 1; // Reset to first page when applying new filters
    this.filterCars();
  }

  clearFilters(): void {
    this.filter = {
      pageIndex: 1,
      pageSize: 10,
    };
    this.filtersApplied = false;
    this.loadCarsPage(1);
    // Update URL by removing filter parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1 },
      queryParamsHandling: '',
    });
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filter.capacity ||
      this.filter.startYear ||
      this.filter.endYear ||
      this.filter.city
    );
  }

  updateUrlWithPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  updateUrlWithFilters(): void {
    // Create a clean object with only defined values
    const queryParams: any = { page: this.filter.pageIndex };

    if (this.filter.capacity) queryParams.capacity = this.filter.capacity;
    if (this.filter.startYear) queryParams.startYear = this.filter.startYear;
    if (this.filter.endYear) queryParams.endYear = this.filter.endYear;
    if (this.filter.city) queryParams.city = this.filter.city;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '', // Replace all existing query params
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
      // If search term is empty, reset filters and reload cars
      this.clearFilters();
      return;
    }

    // For simple search, we'll just filter the current cars in memory
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCars = this.allCars.filter((car) => {
      const brandMatch = car.brand?.toLowerCase().includes(term) ?? false;
      const modelMatch = car.model?.toLowerCase().includes(term) ?? false;
      return brandMatch || modelMatch;
    });

    console.log('გაფილტრული მანქანები:', this.filteredCars);
  }

  calculateCarPrice(car: Car): number {
    // Ensure proper numeric calculation
    const price =
      typeof car.price === 'number'
        ? car.price
        : parseFloat(car.price as any) || 0;
    const multiplier =
      typeof car.multiplier === 'number'
        ? car.multiplier
        : parseFloat(car.multiplier as any) || 1;

    // Use default multiplier of 1 if missing or invalid
    const finalMultiplier =
      isNaN(multiplier) || multiplier <= 0 ? 1 : multiplier;

    return price * finalMultiplier;
  }
}
