import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.movieService
      .getActiveMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movies) => {
          this.movies.set(movies);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.errorMessage.set('Failed to load movies. Please try again.');
          this.isLoading.set(false);
        }
      });
  }

  selectMovie(movieId: string): void {
    void this.router.navigate(['/movies', movieId]);
  }

  retry(): void {
    this.loadMovies();
  }
}
