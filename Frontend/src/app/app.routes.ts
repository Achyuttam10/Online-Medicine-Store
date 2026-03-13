import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/medicines/medicine-list/medicine-list.component').then(
        (m) => m.MedicineListComponent
      )
  },
  {
    path: 'medicine/:id',
    loadComponent: () =>
      import('./features/medicines/medicine-detail/medicine-detail.component').then(
        (m) => m.MedicineDetailComponent
      )
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      )
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' } // Wildcard fallback
];
