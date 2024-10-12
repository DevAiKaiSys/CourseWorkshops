import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | undefined;
  // Simulated users (you can replace this with a real API call)
  private users: { [key: string]: string } = {
    user1: 'password1',
    user2: 'password2',
  };

  // Simulate an authentication check
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Simulate logging in
  login(username: string, password: string): boolean {
    if (this.users[username] && this.users[username] === password) {
      this.token = 'dummy-token'; // Assign a token (this could be a JWT in a real app)
      return true; // Login successful
    }
    return false; // Login failed
  }

  // Simulate logging out
  logout() {
    this.token = undefined;
  }

  // Get the stored token
  getToken(): string | undefined {
    return this.token;
  }
}
