import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Hall } from '../../halls/hall.models';
import { HallService } from '../../halls/hall.service';
import { Movie } from '../../movies/movie.models';
import { MovieService } from '../../movies/movie.service';
import { mapScreeningErrorMessage } from '../screening-error.util';
import { ScreeningListItem, ScreeningViewModel } from '../screening.models';
import { ScreeningService } from '../screening.service';

@Component({
  selector: 'app-screening-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './screening-list.component.html',
  styleUrl: './screening-list.component.css'
})
export class ScreeningListComponent implements AfterViewInit, OnDestroy, OnInit {
  private readonly movieService = inject(MovieService);
  private readonly hallService = inject(HallService);
  private readonly screeningService = inject(ScreeningService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  @ViewChild('loadMoreTrigger') private loadMoreTrigger?: ElementRef<HTMLElement>;
  private intersectionObserver?: IntersectionObserver;

  readonly screenings = signal<ScreeningViewModel[]>([]);
  readonly movies = signal<Movie[]>([]);
  readonly halls = signal<Hall[]>([]);
  readonly selectedMovieId = signal('');
  readonly selectedHallId = signal('');
  readonly loading = signal(true);
  readonly loadingMore = signal(false);
  readonly error = signal<string | null>(null);
  readonly warning = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly hasMore = signal(false);
  readonly hasScreenings = computed(() => this.screenings().length > 0);

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    forkJoin({ movies: this.movieService.getMovies(), halls: this.hallService.getHalls() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ movies, halls }) => {
          this.movies.set(movies);
          this.halls.set(halls);
          this.loadScreenings();
        },
        error: (error) => {
          this.error.set(error?.message ?? mapScreeningErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.loadNextPage();
      }
    }, { rootMargin: '240px' });
    if (this.loadMoreTrigger) {
      this.intersectionObserver.observe(this.loadMoreTrigger.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  loadScreenings(): void {
    this.screenings.set([]);
    this.loadPage(1, false);
  }

  loadNextPage(): void {
    if (!this.loading() && !this.loadingMore() && this.hasMore()) {
      this.loadPage(this.nextPage, true);
    }
  }

  onMovieFilterChange(event: Event): void {
    this.selectedMovieId.set((event.target as HTMLSelectElement).value);
    this.loadScreenings();
  }

  onHallFilterChange(event: Event): void {
    this.selectedHallId.set((event.target as HTMLSelectElement).value);
    this.loadScreenings();
  }

  clearMovieFilter(): void {
    this.selectedMovieId.set('');
    this.loadScreenings();
  }

  clearHallFilter(): void {
    this.selectedHallId.set('');
    this.loadScreenings();
  }

  private nextPage = 1;

  private loadPage(page: number, append: boolean): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set(null);
    this.warning.set(null);

    this.screeningService.getScreenings(
      page,
      10,
      this.selectedMovieId() || undefined,
      this.selectedHallId() || undefined
    )
      .pipe(
        catchError((error) => {
          this.error.set(error?.message ?? mapScreeningErrorMessage(error));
          return of(null);
        }),
        finalize(() => {
          this.loading.set(false);
          this.loadingMore.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (!response) return;
          const current = this.screenings();
          const incoming = response.items.map((screening) => this.toViewModel(screening));
          this.screenings.set(append ? [...current, ...incoming] : incoming);
          this.nextPage = response.page + 1;
          this.hasMore.set(response.page * response.pageSize < response.totalCount);
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

  private toViewModel(screening: ScreeningListItem): ScreeningViewModel {
    return {
      ...screening,
      movieTitle: screening.movie.title,
      hallName: screening.hall.title,
      hallType: screening.hall.type,
      isPast: new Date(screening.startDateTime) < new Date()
    };
  }

}
