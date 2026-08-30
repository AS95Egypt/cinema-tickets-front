import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, concatMap, forkJoin, from, map, of, toArray } from 'rxjs';
import { Hall } from '../../halls/hall.models';
import { HallService } from '../../halls/hall.service';
import { Movie } from '../../movies/movie.models';
import { MovieService } from '../../movies/movie.service';
import { mapScreeningErrorMessage } from '../screening-error.util';
import { Screening, ScreeningViewModel } from '../screening.models';
import { ScreeningService } from '../screening.service';

interface ScreeningGroup {
  dateKey: string;
  screenings: ScreeningViewModel[];
}

@Component({
  selector: 'app-screening-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './screening-list.component.html',
  styleUrl: './screening-list.component.css'
})
export class ScreeningListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly hallService = inject(HallService);
  private readonly screeningService = inject(ScreeningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly groups = signal<ScreeningGroup[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly warning = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly hasScreenings = computed(() => this.groups().some((group) => group.screenings.length > 0));

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    this.loadScreenings();
  }

  loadScreenings(): void {
    this.loading.set(true);
    this.error.set(null);
    this.warning.set(null);

    forkJoin({ movies: this.movieService.getMovies(), halls: this.hallService.getHalls() })
      .pipe(
        concatMap(({ movies, halls }) =>
          from(movies).pipe(
            concatMap((movie) =>
              this.screeningService.getScreeningsForMovie(movie.id).pipe(
                map((screenings) => screenings.map((screening) => this.toViewModel(screening, movie, halls))),
                catchError(() => {
                  this.warning.set('Some screenings could not be loaded. Refresh to try again.');
                  return of([] as ScreeningViewModel[]);
                })
              )
            ),
            toArray()
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (nested) => {
          this.groups.set(this.groupScreenings(nested.flat()));
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error?.message ?? mapScreeningErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  createScreening(): void {
    void this.router.navigate(['/admin/screenings/create']);
  }

  formatPrice(price: number): string {
    return `${price} EGP`;
  }

  formatDate(dateKey: string): string {
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(value: string): string {
    return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  private toViewModel(screening: Screening, movie: Movie, halls: Hall[]): ScreeningViewModel {
    const hall = halls.find((item) => item.id === screening.hallId);
    return {
      ...screening,
      movieTitle: movie.title,
      hallName: hall?.title ?? 'Unknown hall',
      hallType: hall?.type ?? 'Unknown',
      isPast: new Date(screening.startDateTime) < new Date()
    };
  }

  private groupScreenings(screenings: ScreeningViewModel[]): ScreeningGroup[] {
    const grouped = new Map<string, ScreeningViewModel[]>();
    for (const screening of screenings) {
      const dateKey = screening.startDateTime.slice(0, 10);
      grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), screening]);
    }

    return Array.from(grouped.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([dateKey, items]) => ({
        dateKey,
        screenings: items.sort((left, right) => left.startDateTime.localeCompare(right.startDateTime))
      }));
  }
}
