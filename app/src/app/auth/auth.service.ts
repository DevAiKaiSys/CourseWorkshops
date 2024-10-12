import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'angular_token';
  private usernameKey = 'angular_username';

  // Simulate an authentication check
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Log in the user and store the token and username
  login(username: string, token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usernameKey, username);
  }

  // Log out the user by clearing the token and username
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get the stored username
  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }
}
