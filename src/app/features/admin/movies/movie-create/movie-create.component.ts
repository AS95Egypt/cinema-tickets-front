import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { mapMovieErrorMessage } from '../movie-error.util';
import { MovieFormValue } from '../movie.models';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-create',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieFormComponent],
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.css'
})
export class MovieCreateComponent {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly serverError = signal<string | null>(null);
  readonly submitting = signal(false);

  submitForm(payload: MovieFormValue): void {
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
      .createMovie(trailerUrl ? { ...request, trailerUrl } : request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin/movies'], {
            state: { successMessage: `${payload.title} created successfully.` }
          });
        },
        error: (error) => {
          this.serverError.set(error?.message ?? mapMovieErrorMessage(error));
          this.submitting.set(false);
        }
      });
  }
}
