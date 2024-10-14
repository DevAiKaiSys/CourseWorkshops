import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private tokenKey = 'angular_token';
  private usernameKey = 'angular_name';
  private userIdKey = 'angular_id';

  // Simulate an authentication check
  isAuthenticated(): boolean {
    return this.isBrowser() && !!this.getToken();
  }

  // Log in the user and store the token and username
  login(username: string, token: string, userId: number): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.usernameKey, username);
      localStorage.setItem(this.userIdKey, userId.toString());
    }
  }

  // Log out the user by clearing the token and username
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.usernameKey);
      localStorage.removeItem(this.userIdKey);
    }
  }

  // Get the stored token
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  // Get the stored username
  getUsername(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.usernameKey) : null;
  }

  // Get the stored userId as a number
  getUserId(): number | null {
    const id = this.isBrowser() ? localStorage.getItem(this.userIdKey) : null;
    return id !== null ? Number(id) : null; // Convert string back to number
  }

  // Helper method to check if running in the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
