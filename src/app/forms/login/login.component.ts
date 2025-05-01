import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create login object
    const loginData = {
      phoneNumber: this.loginForm.value.phoneNumber,
      password: this.loginForm.value.password,
      // Only include email if it's not empty
      ...(this.loginForm.value.email
        ? { email: this.loginForm.value.email }
        : {}),
    };

    console.log('Attempting login with data:', loginData);

    this.userService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful, response:', response);
        this.successMessage =
          'წარმატებით შეხვედით სისტემაში! გადამისამართება...';

        // Set auth state directly in local storage to ensure it's available
        localStorage.setItem('isLoggedIn', 'true');

        // Use a longer delay to ensure everything is saved
        setTimeout(() => {
          // Use window.location for complete page reload
          window.location.href = '/';
        }, 1500);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'არასწორი მონაცემები. გთხოვთ სცადოთ თავიდან.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
