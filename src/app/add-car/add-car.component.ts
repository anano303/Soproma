import { Component } from '@angular/core';
import { CarService } from '../car.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
  imports:[CommonModule,ReactiveFormsModule]
})
export class AddCarComponent {
  carForm: FormGroup;
  selectedImages: File[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router
  ) {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      price: ['', [Validators.required, Validators.min(0)]],
      city: ['', Validators.required],
      transmission: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      fuelCapacity: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      multiplier: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onFileSelected(event: any): void {
    this.selectedImages = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (this.carForm.invalid || this.selectedImages.length === 0) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა საჭირო ველი და ატვირთოთ მინიმუმ ერთი სურათი';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    Object.keys(this.carForm.value).forEach(key => {
      formData.append(key, this.carForm.value[key]);
    });

    this.selectedImages.forEach((image, index) => {
      formData.append(`imageUrl${index + 1}`, image);
    });

    this.carService.addCar(formData).subscribe({
      next: (response) => {
        this.successMessage = 'მანქანა წარმატებით დაემატა!';
        this.carForm.reset();
        this.selectedImages = [];
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'დაფიქსირდა შეცდომა: ' + (err.error?.message || err.message);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}