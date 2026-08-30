import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReservationStateService } from '../services/reservation-state.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css'
})
export class SeatSelectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly reservationState = inject(ReservationStateService);

  readonly submitting = signal(false);

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('movieId');
    const screeningId = this.route.snapshot.paramMap.get('screeningId');
    const routePrice = Number(this.route.snapshot.queryParamMap.get('price'));
    this.reservationState.setRouteContext(movieId, screeningId, Number.isFinite(routePrice) ? routePrice : 0);
    if (screeningId) {
      this.reservationState.loadSeatAvailability(screeningId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  get seatsPerRow(): number {
    const count = this.totalSeatCount;
    return Math.max(4, Math.ceil(Math.sqrt(count)));
  }

  get totalSeatCount(): number {
    const availability = this.reservationState.seatAvailability();
    return availability?.hall?.numberOfSeats ?? availability?.numberOfSeats ?? availability?.seats?.length ?? 0;
  }

  rows(): number[] {
    const count = this.totalSeatCount;
    return Array.from({ length: Math.ceil(count / this.seatsPerRow) }, (_, index) => index);
  }

  rowSeats(rowIndex: number): number[] {
    const total = this.totalSeatCount;
    const start = rowIndex * this.seatsPerRow + 1;
    return Array.from({ length: Math.min(this.seatsPerRow, total - rowIndex * this.seatsPerRow) }, (_, index) => start + index);
  }

  seatState(seatNumber: number) {
    return this.reservationState.seats().find((seat) => seat.seatNumber === seatNumber)?.state ?? 'available';
  }

  selectSeat(seatNumber: number): void {
    this.reservationState.selectSeat(seatNumber);
  }

  continue(): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.reservationState.createHold().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (reservation) => {
        if (reservation?.reservationId) {
          void this.router.navigate(['/reservations', reservation.reservationId]);
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }
}
