import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { Hall } from '../../halls/hall.models';
import { HallService } from '../../halls/hall.service';
import { Movie } from '../../movies/movie.models';
import { MovieService } from '../../movies/movie.service';
import { mapScreeningErrorMessage } from '../screening-error.util';
import { CreateScreeningRequest } from '../screening.models';
import { ScreeningService } from '../screening.service';

@Component({
  selector: 'app-screening-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './screening-create.component.html',
  styleUrl: './screening-create.component.css'
})
export class ScreeningCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly movieService = inject(MovieService);
  private readonly hallService = inject(HallService);
  private readonly screeningService = inject(ScreeningService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly movies = signal<Movie[]>([]);
  readonly halls = signal<Hall[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.group({
    movieId: ['', Validators.required],
    hallId: ['', Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(.01), Validators.pattern(/^\d+(\.\d+)?$/)]]
  });

  ngOnInit(): void {
    forkJoin({ movies: this.movieService.getActiveMovies(), halls: this.hallService.getHalls() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ movies, halls }) => {
          this.movies.set(movies.filter((movie) => movie.isActive));
          this.halls.set(halls.filter((hall) => hall.isActive));
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(mapScreeningErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting() || !this.movies().length || !this.halls().length) {
      return;
    }

    const raw = this.form.getRawValue();
    const movieId = raw.movieId ?? '';
    const hallId = raw.hallId ?? '';
    const startDate = raw.startDate ?? '';
    const startTime = raw.startTime ?? '';
    const request: CreateScreeningRequest = {
      hallId,
      // Keep the browser-local date/time as a naive ISO value. The backend owns timezone interpretation, so no UTC conversion or offset is added.
      startDateTime: `${startDate}T${startTime}:00`,
      price: Number(raw.price)
    };

    this.serverError.set(null);
    this.submitting.set(true);
    this.screeningService.createScreening(movieId, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        void this.router.navigate(['/admin/screenings'], { state: { successMessage: 'Screening created successfully.' } });
      },
      error: (error) => {
        this.serverError.set(error?.message ?? mapScreeningErrorMessage(error));
        this.submitting.set(false);
      }
    });
  }
}
