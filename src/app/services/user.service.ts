import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDTO } from '../models/userDTO.model';
import { Users } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://rentcar.stepprojects.ge/api/Users';
  private currentUserSubject: BehaviorSubject<Users | null> =
    new BehaviorSubject<Users | null>(null);
  public currentUser: Observable<Users | null> =
    this.currentUserSubject.asObservable();
  private tokenCheckInterval: any;

  constructor(private http: HttpClient) {
    this.initUserFromStorage();
    this.startTokenValidityCheck();
  }

  // Initialize user from localStorage - safer approach
  private initUserFromStorage(): void {
    try {
      const savedUserString = localStorage.getItem('currentUser');
      // Only attempt to parse if the string is not null or undefined
      if (
        savedUserString &&
        savedUserString !== 'undefined' &&
        savedUserString !== 'null'
      ) {
        const savedUser = JSON.parse(savedUserString);
        this.currentUserSubject.next(savedUser);
        console.log('User loaded from storage:', !!savedUser);
      } else {
        console.log('No valid user data in storage');
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }

  // Register new user
  register(user: UserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  // Login user - completely revised for reliability
  login(user: Partial<UserDTO>): Observable<any> {
    console.log('Login attempt with:', user);

    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap({
        next: (response) => {
          console.log('Login API response:', response);

          // Make sure we have a token before proceeding
          if (response && response.token) {
            try {
              // Store token first
              localStorage.setItem('token', response.token);

              // Then store user data if available
              if (response.user) {
                const userJson = JSON.stringify(response.user);
                localStorage.setItem('currentUser', userJson);
                this.currentUserSubject.next(response.user);
                console.log(
                  'User data stored successfully. Auth state updated.'
                );
              } else {
                // Create a minimal user object if none provided
                const minimalUser = { phoneNumber: user.phoneNumber } as Users;
                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(minimalUser)
                );
                this.currentUserSubject.next(minimalUser);
                console.log(
                  'Created minimal user profile. Auth state updated.'
                );
              }
            } catch (error) {
              console.error('Storage error during login:', error);
              // Even if storage fails, we can still update the in-memory state
              if (response.user) {
                this.currentUserSubject.next(response.user);
              }
            }
          } else {
            console.warn('Login response missing token');
          }
        },
        error: (error) => {
          console.error('Login request failed:', error);
        },
      })
    );
  }

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  // Get current logged in user
  public get currentUserValue(): Users | null {
    return this.currentUserSubject.value;
  }

  // Enhanced isLoggedIn check - more reliable
  isLoggedIn(): boolean {
    try {
      const hasToken = !!localStorage.getItem('token');
      const hasUser =
        !!this.currentUserValue || !!localStorage.getItem('currentUser');
      const isLoggedIn = hasToken && hasUser;
      console.log(
        `Auth check: hasToken=${hasToken}, hasUser=${hasUser}, isLoggedIn=${isLoggedIn}`
      );
      return isLoggedIn;
    } catch (e) {
      console.error('Error checking login status:', e);
      return false;
    }
  }

  // Start periodic check for token validity
  private startTokenValidityCheck(): void {
    // Check token validity every 30 seconds
    this.tokenCheckInterval = setInterval(() => {
      this.checkAndUpdateAuthStatus();
    }, 30000);
  }

  // Check if the token is still valid
  private checkAndUpdateAuthStatus(): void {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token found, log out
        console.log('No auth token found, logging out');
        this.logout();
        return;
      }

      // Check if token is expired (if it's JWT)
      if (this.isTokenExpired(token)) {
        console.log('Auth token expired, logging out');
        this.logout();
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
    }
  }

  // Basic check for JWT token expiration
  private isTokenExpired(token: string): boolean {
    try {
      // For JWT tokens - decode and check expiration
      // This is a simple implementation, more robust implementations would use a JWT library
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        // Not a JWT token, can't determine if expired
        return false;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.exp) {
        // No expiration claim
        return false;
      }

      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      // If there's an error parsing, conservatively assume token is valid
      return false;
    }
  }

  // Clean up on service destroy
  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}
