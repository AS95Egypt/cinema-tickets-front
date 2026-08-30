import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapMovieErrorMessage } from '../movie-error.util';
import { MovieService } from '../movie.service';
import { Movie } from '../movie.models';

type MovieFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly filter = signal<MovieFilter>('all');

  readonly filteredMovies = computed(() => {
    const filter = this.filter();
    const movies = this.movies();

    if (filter === 'active') {
      return movies.filter((movie) => movie.isActive);
    }

    if (filter === 'inactive') {
      return movies.filter((movie) => !movie.isActive);
    }

    return movies;
  });

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set(null);

    this.movieService
      .getMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movies) => {
          this.movies.set(movies);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error?.message ?? mapMovieErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  setFilter(filter: MovieFilter): void {
    this.filter.set(filter);
  }

  createMovie(): void {
    void this.router.navigate(['/admin/movies/create']);
  }

  viewMovie(id: string): void {
    void this.router.navigate(['/admin/movies', id]);
  }

  editMovie(id: string): void {
    void this.router.navigate(['/admin/movies', id, 'edit']);
  }

  toggleMovie(movie: Movie): void {
    const action = movie.isActive ? 'deactivate' : 'activate';
    const wasActive = movie.isActive;
    if (!window.confirm(`Are you sure you want to ${action} ${movie.title}?`)) {
      return;
    }

    const request$ = movie.isActive ? this.movieService.deactivateMovie(movie.id) : this.movieService.activateMovie(movie.id);
    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedMovie) => {
        this.movies.update((current) =>
          current.map((item) =>
            item.id === movie.id
              ? {
                  ...item,
                  isActive: updatedMovie?.isActive ?? !wasActive,
                  updatedAt: updatedMovie?.updatedAt ?? item.updatedAt
                }
              : item
          )
        );
        this.successMessage.set(wasActive ? `${movie.title} deactivated successfully.` : `${movie.title} activated successfully.`);
      },
      error: (error) => {
        this.error.set(error?.message ?? mapMovieErrorMessage(error));
      }
    });
  }
}
