import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { authGuard } from './auth/auth.guard';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: SignInComponent,
  },
];
