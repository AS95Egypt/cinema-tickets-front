import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', loadComponent: () => import('./features/movies/movie-list/movie-list.component').then((m) => m.MovieListComponent) },
  { path: 'movies/:id', loadComponent: () => import('./features/movies/movie-details/movie-details.component').then((m) => m.MovieDetailsComponent) },
  {
    path: 'movies/:movieId/screenings/:screeningId/seats',
    loadComponent: () => import('./features/reservation/seat-selection/seat-selection.component').then((m) => m.SeatSelectionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservations/:reservationId',
    loadComponent: () => import('./features/reservation/reservation-summary/reservation-summary.component').then((m) => m.ReservationSummaryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/admin/forbidden/forbidden.component').then((m) => m.ForbiddenComponent)
  },
  { path: 'checkout/:reservationId', redirectTo: '/movies' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent) },
  { path: '**', redirectTo: '' }
];
