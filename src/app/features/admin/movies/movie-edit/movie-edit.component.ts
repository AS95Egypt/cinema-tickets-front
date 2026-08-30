import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { mapMovieErrorMessage } from '../movie-error.util';
import { Movie, MovieFormValue } from '../movie.models';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieFormComponent],
  templateUrl: './movie-edit.component.html',
  styleUrl: './movie-edit.component.css'
})
export class MovieEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);
  private readonly destroyRef = inject(DestroyRef);

  readonly movie = signal<Movie | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly serverError = signal<string | null>(null);
  readonly submitting = signal(false);

  private movieId: string | null = null;

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (!this.movieId) {
      this.error.set('The requested movie could not be found.');
      this.loading.set(false);
      return;
    }

    this.loadMovie();
  }

  loadMovie(): void {
    if (!this.movieId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.movieService
      .getMovie(this.movieId)
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

  submitForm(payload: MovieFormValue): void {
    if (!this.movieId) {
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const request = {
      title: payload.title,
      genre: payload.genre || '',
      duration: payload.duration ?? 0,
      releaseDate: payload.releaseDate,
      language: payload.language,
      description: payload.description,
      actors: payload.actors
    } as const;

    const trailerUrl = payload.trailerUrl.trim();

    this.movieService
      .updateMovie(this.movieId, trailerUrl ? { ...request, trailerUrl } : request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin/movies'], {
            state: { successMessage: `${payload.title} updated successfully.` }
          });
        },
        error: (error) => {
          this.serverError.set(error?.message ?? mapMovieErrorMessage(error));
          this.submitting.set(false);
        }
      });
  }
}
