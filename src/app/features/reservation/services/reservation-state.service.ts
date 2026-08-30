import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, interval, Observable, of, tap, throwError } from 'rxjs';
import { ReservationService } from './reservation.service';
import { CreateReservationRequest, ReservationResponse, SeatAvailabilityResponse, SeatState } from '../models/reservation.model';

interface SeatViewModel {
  seatNumber: number;
  state: SeatState;
}

@Injectable({ providedIn: 'root' })
export class ReservationStateService {
  private static readonly STORAGE_KEY = 'reservation.hold';

  private readonly reservationService = inject(ReservationService);

  readonly screeningId = signal<string | null>(null);
  readonly movieId = signal<string | null>(null);
  readonly selectedSeat = signal<number | null>(null);
  readonly reservationId = signal<string | null>(null);
  readonly reservationStatus = signal<ReservationResponse['status'] | 'Idle'>('Idle');
  readonly expiresAt = signal<string | null>(null);
  readonly price = signal<number>(0);
  readonly conflictMessage = signal('');
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);
  readonly seatAvailability = signal<SeatAvailabilityResponse | null>(null);
  readonly secondsRemaining = signal(0);
  readonly seats = computed<SeatViewModel[]>(() => {
    const availability = this.seatAvailability();
    if (!availability) {
      return [];
    }

    const apiSeats = availability.seats;
    if (Array.isArray(apiSeats) && apiSeats.length > 0) {
      const selectedSeat = this.selectedSeat();
      return apiSeats.map((seat) => {
        const seatNumber = seat.seatNumber ?? seat.seatNo ?? 0;
        const state = seat.state ?? this.mapSeatStatus(seat.status) ?? 'available';

        return {
          seatNumber,
          state: seatNumber === selectedSeat && state === 'available' ? 'selected' : state
        };
      });
    }

    const unavailable = new Set(availability.unavailableSeatNumbers ?? []);
    const selectedSeat = this.selectedSeat();
    const totalSeats = availability.numberOfSeats ?? availability.hall?.numberOfSeats ?? 0;

    return Array.from({ length: totalSeats }, (_, index) => {
      const seatNumber = index + 1;
      if (seatNumber === selectedSeat) {
        return { seatNumber, state: 'selected' };
      }
      if (unavailable.has(seatNumber)) {
        return { seatNumber, state: 'held' };
      }
      return { seatNumber, state: 'available' };
    });
  });

  constructor() {
    interval(1000).subscribe(() => this.tick());
  }

  private mapSeatStatus(status?: string): SeatState | null {
    switch (status) {
      case 'AVAILABLE':
        return 'available';
      case 'RESERVED':
      case 'HELD':
        return 'held';
      case 'SELECTED':
        return 'selected';
      default:
        return null;
    }
  }

  loadSeatAvailability(screeningId: string) {
    this.screeningId.set(screeningId);
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.conflictMessage.set('');
    this.selectedSeat.set(null);

    return this.reservationService.getSeatAvailability(screeningId).pipe(
      tap((availability) => {
        this.seatAvailability.set(availability);
        this.price.set(availability.price ?? this.price());
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.status === 404 ? 'This screening no longer exists.' : 'Failed to load seats. Please try again.');
        return throwError(() => error);
      })
    );
  }

  setRouteContext(movieId: string | null, screeningId: string | null, price: number): void {
    this.movieId.set(movieId);
    this.screeningId.set(screeningId);
    this.price.set(price);
  }

  selectSeat(seatNumber: number): void {
    const seat = this.seats().find((item) => item.seatNumber === seatNumber);
    if (seat?.state === 'available') {
      this.selectedSeat.set(seatNumber);
    } else if (seat?.state === 'selected') {
      this.selectedSeat.set(null);
    }
  }

  deselectSeat(): void {
    this.selectedSeat.set(null);
  }

  createHold(): Observable<ReservationResponse> {
    const screeningId = this.screeningId();
    const seatNumber = this.selectedSeat();

    if (!screeningId || !seatNumber) {
      return throwError(() => new Error('Missing screening or seat selection.'));
    }

    this.isLoading.set(true);
    this.conflictMessage.set('');
    const request: CreateReservationRequest = {
      screeningId,
      seatNo: seatNumber,
    };

    return this.reservationService.createReservation(request).pipe(
      tap((reservation) => this.applyReservation(reservation)),
      catchError((error) => {
        this.isLoading.set(false);
        if (error?.status === 409) {
          this.conflictMessage.set('Sorry, one or selected seat are no longer available. Please select different seat.');
          this.loadSeatAvailability(screeningId).subscribe();
          return EMPTY;
        }
        this.errorMessage.set(error?.status === 500 ? 'Something went wrong. Please try again later.' : 'Failed to reserve seat. Please try again.');
        return throwError(() => error);
      })
    );
  }

  restoreFromStorage(reservationId: string): void {
    const stored = sessionStorage.getItem(ReservationStateService.STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const data = JSON.parse(stored) as { reservationId?: string; screeningId?: string; expiresAt?: string };
      if (data.reservationId === reservationId && data.screeningId) {
        this.reservationId.set(data.reservationId ?? null);
        this.screeningId.set(data.screeningId ?? null);
        this.expiresAt.set(data.expiresAt ?? null);
        this.reservationStatus.set('Held');
      }
    } catch {
      sessionStorage.removeItem(ReservationStateService.STORAGE_KEY);
    }
  }

  private applyReservation(reservation: ReservationResponse): void {
    this.reservationId.set(reservation.reservationId);
    this.reservationStatus.set(reservation.status);
    this.expiresAt.set(reservation.expiresAt);
    if (reservation.price !== undefined) {
      this.price.set(reservation.price);
    }
    this.isLoading.set(false);
    sessionStorage.setItem(
      ReservationStateService.STORAGE_KEY,
      JSON.stringify({ reservationId: reservation.reservationId, screeningId: reservation.screeningId, expiresAt: reservation.expiresAt })
    );
  }

  private tick(): void {
    const expiresAt = this.expiresAt();
    if (!expiresAt || this.reservationStatus() !== 'Held') {
      return;
    }

    const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    this.secondsRemaining.set(remaining);
    if (remaining === 0) {
      this.reservationStatus.set('Expired');
    }
  }
}
