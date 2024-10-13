import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private tokenKey = 'angular_token';
  private usernameKey = 'angular_name';

  // Simulate an authentication check
  isAuthenticated(): boolean {
    return this.isBrowser() && !!this.getToken();
  }

  // Log in the user and store the token and username
  login(username: string, token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.usernameKey, username);
    }
  }

  // Log out the user by clearing the token and username
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.usernameKey);
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

  // Helper method to check if running in the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
