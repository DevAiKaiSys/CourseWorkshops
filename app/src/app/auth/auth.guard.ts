import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we are running in the browser
  if (isPlatformBrowser(platformId)) {
    if (authService.isAuthenticated()) {
      return true;
    } else {
      const redirectUrl = state.url;
      router.navigate(['/login'], { queryParams: { redirectTo: redirectUrl } }); // Redirect to the login page if not authenticated
      return false;
    }
  }

  // Allow access for server-side rendering (optional behavior)
  return true; // or false based on your requirements
};
