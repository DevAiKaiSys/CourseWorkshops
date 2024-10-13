import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { authGuard } from './auth/auth.guard';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { FoodSizeComponent } from './food-size/food-size.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'foodtype',
        component: FoodTypeComponent,
      },
      {
        path: 'foodsize',
        component: FoodSizeComponent,
      },
    ],
  },
  {
    path: 'login',
    component: SignInComponent,
  },
];
