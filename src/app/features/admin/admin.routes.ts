import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'halls', loadComponent: () => import('./halls/hall-list/hall-list.component').then((m) => m.HallListComponent) },
      { path: 'halls/create', loadComponent: () => import('./halls/hall-create/hall-create.component').then((m) => m.HallCreateComponent) },
      { path: 'halls/:id/edit', loadComponent: () => import('./halls/hall-edit/hall-edit.component').then((m) => m.HallEditComponent) },
      { path: 'halls/:id', loadComponent: () => import('./halls/hall-details/hall-details.component').then((m) => m.HallDetailsComponent) },
      { path: 'movies', loadComponent: () => import('./movies/movie-list/movie-list.component').then((m) => m.MovieListComponent) },
      { path: 'movies/create', loadComponent: () => import('./movies/movie-create/movie-create.component').then((m) => m.MovieCreateComponent) },
      { path: 'movies/:id/edit', loadComponent: () => import('./movies/movie-edit/movie-edit.component').then((m) => m.MovieEditComponent) },
      { path: 'movies/:id', loadComponent: () => import('./movies/movie-details/movie-details.component').then((m) => m.MovieDetailsComponent) },
      { path: 'screenings', loadComponent: () => import('./screenings/screening-list/screening-list.component').then((m) => m.ScreeningListComponent) },
      { path: 'screenings/create', loadComponent: () => import('./screenings/screening-create/screening-create.component').then((m) => m.ScreeningCreateComponent) }
    ]
  }
];
