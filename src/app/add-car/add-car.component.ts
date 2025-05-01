import { Component, OnInit } from '@angular/core';
import { CarService } from '../car.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddCarComponent implements OnInit {
  carForm: FormGroup;
  selectedImages: File[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      price: ['', [Validators.required, Validators.min(0)]],
      city: ['', Validators.required],
      transmission: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      fuelCapacity: ['', [Validators.required, Validators.min(0)]],
      createdBy: ['User', Validators.required],
      createdByEmail: [
        'user@example.com',
        [Validators.required, Validators.email],
      ],
      ownerPhoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{9}$/)],
      ],
      latitude: [0],
      longitude: [0],
      multiplier: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Populate and lock the phone number field
    this.setUserPhoneNumber();
  }

  private setUserPhoneNumber(): void {
    // Check if user is logged in
    if (this.userService.isLoggedIn()) {
      // Try getting user from current value first
      const currentUser = this.userService.currentUserValue;

      if (currentUser?.phoneNumber) {
        this.setPhoneNumberInForm(currentUser.phoneNumber);
      } else {
        // Fallback: try to get from localStorage
        try {
          const savedUserString = localStorage.getItem('currentUser');
          if (
            savedUserString &&
            savedUserString !== 'undefined' &&
            savedUserString !== 'null'
          ) {
            const savedUser = JSON.parse(savedUserString);
            if (savedUser?.phoneNumber) {
              this.setPhoneNumberInForm(savedUser.phoneNumber);
            }
          }
        } catch (error) {
          console.error('Error getting phone number from storage:', error);
          this.redirectToLogin();
        }
      }
    } else {
      console.log('User not logged in, redirecting to login');
      this.redirectToLogin();
    }
  }

  private setPhoneNumberInForm(phoneNumber: string): void {
    // Set the value in the form
    this.carForm.patchValue({
      ownerPhoneNumber: phoneNumber,
    });

    // Disable the field so it can't be edited
    this.carForm.get('ownerPhoneNumber')?.disable();

    console.log('Phone number set and locked:', phoneNumber);
  }

  private redirectToLogin(): void {
    // Show a message and redirect to login
    alert('გთხოვთ გაიაროთ ავტორიზაცია მანქანის დასამატებლად');
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedImages = Array.from(files).slice(0, 3) as File[];
      console.log(
        'Selected images:',
        this.selectedImages.map((file) => file.name)
      );

      // Check file sizes
      this.selectedImages.forEach((file) => {
        console.log(`File ${file.name} size: ${file.size / 1024} KB`);
      });
    }
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა საჭირო ველი';
      Object.keys(this.carForm.controls).forEach((key) => {
        if (this.carForm.controls[key].invalid) {
          console.log(
            `Field '${key}' is invalid:`,
            this.carForm.controls[key].errors
          );
        }
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();

    // Get raw values from form including disabled fields
    const rawValues = this.carForm.getRawValue();

    // Handle multiplier explicitly to ensure it's saved correctly
    const multiplier = parseFloat(rawValues.multiplier);
    if (!isNaN(multiplier)) {
      formData.append('multiplier', multiplier.toString());
      console.log('Multiplier set in form data:', multiplier);
    } else {
      // Default multiplier to 1 if not valid
      formData.append('multiplier', '1');
      console.log('Using default multiplier value: 1');
    }

    // Handle all other form fields
    Object.keys(rawValues).forEach((key) => {
      if (
        key !== 'multiplier' &&
        rawValues[key] !== null &&
        rawValues[key] !== undefined
      ) {
        formData.append(key, rawValues[key]);
      }
    });

    // Try both capitalized and non-capitalized image field names
    if (this.selectedImages.length > 0) {
      formData.append(
        'Image1',
        this.selectedImages[0],
        this.selectedImages[0].name
      );

      formData.append(
        'image1',
        this.selectedImages[0],
        this.selectedImages[0].name
      );

      this.convertFileToBase64(this.selectedImages[0]).then((base64) => {
        formData.append('ImageBase64_1', base64);
      });

      if (this.selectedImages.length > 1) {
        formData.append(
          'Image2',
          this.selectedImages[1],
          this.selectedImages[1].name
        );
        formData.append(
          'image2',
          this.selectedImages[1],
          this.selectedImages[1].name
        );

        this.convertFileToBase64(this.selectedImages[1]).then((base64) => {
          formData.append('ImageBase64_2', base64);
        });
      }

      if (this.selectedImages.length > 2) {
        formData.append(
          'Image3',
          this.selectedImages[2],
          this.selectedImages[2].name
        );
        formData.append(
          'image3',
          this.selectedImages[2],
          this.selectedImages[2].name
        );

        this.convertFileToBase64(this.selectedImages[2]).then((base64) => {
          formData.append('ImageBase64_3', base64);
        });
      }
    }

    console.log('Submitting form data for new car');

    // Log form data entries for debugging
    formData.forEach((value, key) => {
      console.log(
        `${key}: ${
          value instanceof File
            ? value.name
            : typeof value === 'string' && value.length > 100
            ? 'Base64 content'
            : value
        }`
      );
    });

    // Make the API request
    this.carService.addCar(formData).subscribe({
      next: (response) => {
        console.log('Car added successfully:', response);

        // Calculate the final price including multiplier for display in success message
        const finalPrice = response.price * (response.multiplier || 1);

        this.successMessage = `მანქანა წარმატებით დაემატა! ფასი: ${finalPrice}₾ / დღე`;
        this.carForm.reset();
        this.selectedImages = [];
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error adding car:', err);
        if (err.error instanceof ErrorEvent) {
          this.errorMessage = `კლიენტის შეცდომა: ${err.error.message}`;
        } else {
          this.errorMessage = `სერვერის შეცდომა (${err.status}): ${
            err.error?.message || err.message || 'Unknown error'
          }`;
          console.error('Response body:', err.error);
        }
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  // Helper method to convert file to base64 string
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
