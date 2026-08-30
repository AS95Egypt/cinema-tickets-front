import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapMovieErrorMessage } from '../movie-error.util';
import { MovieService } from '../movie.service';
import { Movie } from '../movie.models';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);
  private readonly destroyRef = inject(DestroyRef);

  readonly movie = signal<Movie | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    this.loadMovie();
  }

  loadMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('The requested movie could not be found.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.movieService
      .getMovie(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movie) => {
          this.movie.set(movie);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error?.message ?? mapMovieErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  back(): void {
    void this.router.navigate(['/admin/movies']);
  }

  edit(): void {
    const movie = this.movie();
    if (!movie) {
      return;
    }

    void this.router.navigate(['/admin/movies', movie.id, 'edit']);
  }

  toggleMovie(): void {
    const movie = this.movie();
    if (!movie) {
      return;
    }

    const action = movie.isActive ? 'deactivate' : 'activate';
    const wasActive = movie.isActive;
    if (!window.confirm(`Are you sure you want to ${action} ${movie.title}?`)) {
      return;
    }

    const request$ = movie.isActive ? this.movieService.deactivateMovie(movie.id) : this.movieService.activateMovie(movie.id);
    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedMovie) => {
        this.movie.update((current) =>
          current
            ? {
                ...current,
                isActive: updatedMovie?.isActive ?? !wasActive,
                updatedAt: updatedMovie?.updatedAt ?? current.updatedAt
              }
            : current
        );
        this.successMessage.set(wasActive ? `${movie.title} deactivated successfully.` : `${movie.title} activated successfully.`);
      },
      error: (error) => {
        this.error.set(error?.message ?? mapMovieErrorMessage(error));
      }
    });
  }
}
