import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    const redirectUrl = state.url;
    router.navigate(['/login'], { queryParams: { redirectTo: redirectUrl } }); // Redirect to the login page if not authenticated
    return false;
  }
};
