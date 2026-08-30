import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieDetailsResponse, Screening } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

interface GroupedScreening {
  date: string;
  screenings: Screening[];
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly movie = signal<MovieDetailsResponse | null>(null);
  readonly groupedScreenings = signal<GroupedScreening[]>([]);
  readonly isLoadingMovie = signal(true);
  readonly isLoadingScreenings = signal(true);
  readonly hasMovieError = signal(false);
  readonly hasScreeningsError = signal(false);
  readonly errorMessage = signal('');

  private movieId = '';

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.movieId = params.get('id') ?? '';
      if (this.movieId) {
        this.loadMovieDetails();
        this.loadScreenings();
      }
    });
  }

  loadMovieDetails(): void {
    this.isLoadingMovie.set(true);
    this.hasMovieError.set(false);
    this.errorMessage.set('');

    this.movieService.getMovieDetails(this.movieId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.isLoadingMovie.set(false);
      },
      error: () => {
        this.hasMovieError.set(true);
        this.errorMessage.set('Failed to load movie details. Please try again.');
        this.isLoadingMovie.set(false);
      }
    });
  }

  loadScreenings(): void {
    this.isLoadingScreenings.set(true);
    this.hasScreeningsError.set(false);

    this.movieService.getScreenings(this.movieId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (screenings) => {
        const normalizedScreenings = Array.isArray(screenings)
          ? screenings
          : Array.isArray((screenings as { screenings?: Screening[] }).screenings)
            ? (screenings as { screenings: Screening[] }).screenings
            : [];

        this.groupedScreenings.set(this.groupScreeningsByDay(normalizedScreenings));
        this.isLoadingScreenings.set(false);
      },
      error: () => {
        this.hasScreeningsError.set(true);
        this.errorMessage.set('Failed to load screenings. Please try again.');
        this.isLoadingScreenings.set(false);
      }
    });
  }

  private groupScreeningsByDay(screenings: Screening[]): GroupedScreening[] {
    const now = new Date();
    const grouped = new Map<string, Screening[]>();

    screenings
      .filter((screening) => new Date(screening.startDateTime) > now)
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
      .forEach((screening) => {
        const dateKey = new Date(screening.startDateTime).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
        const existing = grouped.get(dateKey) ?? [];
        grouped.set(dateKey, [...existing, screening]);
      });

    return Array.from(grouped.entries()).map(([date, groupedScreenings]) => ({ date, screenings: groupedScreenings }));
  }

  getScreeningTime(startDateTime: string): string {
    return new Date(startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  selectScreening(screening: Screening): void {
    void this.router.navigate(['/movies', this.movieId, 'screenings', screening.id, 'seats'], {
      queryParams: { price: screening.price }
    });
  }

  goBack(): void {
    void this.router.navigate(['/movies']);
  }
}
