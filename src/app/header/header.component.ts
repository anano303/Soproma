import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authCheckSubscription?: Subscription;
  private userSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Check auth status immediately
    this.updateLoginStatus();

    // Subscribe to user subject to get updates when login/logout happens
    this.userSubscription = this.userService.currentUser.subscribe((user) => {
      this.ngZone.run(() => {
        this.isLoggedIn = !!user || !!localStorage.getItem('token');
        console.log('Auth subject updated, logged in:', this.isLoggedIn);
      });
    });

    // Check auth status every 5 seconds
    this.authCheckSubscription = interval(5000).subscribe(() => {
      this.updateLoginStatus();
    });

    // Also check when window gets focus
    window.addEventListener('focus', () => this.updateLoginStatus());
  }

  ngOnDestroy() {
    if (this.authCheckSubscription) {
      this.authCheckSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    window.removeEventListener('focus', () => this.updateLoginStatus());
  }

  updateLoginStatus() {
    const wasLoggedIn = this.isLoggedIn;
    const hasToken = !!localStorage.getItem('token');
    const explicitLoginFlag = localStorage.getItem('isLoggedIn') === 'true';

    this.ngZone.run(() => {
      this.isLoggedIn =
        hasToken || explicitLoginFlag || this.userService.isLoggedIn();
      console.log('Header login status updated:', this.isLoggedIn);

      // If login status changed from true to false, user was logged out
      if (wasLoggedIn && !this.isLoggedIn) {
        console.log('User was logged out, updating UI');
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();

    // Clear all auth flags
    this.userService.logout();
    localStorage.removeItem('isLoggedIn');

    // Update UI
    this.isLoggedIn = false;

    // Force page refresh
    window.location.href = '/';
  }
}
