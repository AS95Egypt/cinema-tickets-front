import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MoviesComponent } from './movies.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: '**', redirectTo: '' }
];
