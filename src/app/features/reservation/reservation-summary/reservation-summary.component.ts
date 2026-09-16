import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { ReservationStateService } from '../services/reservation-state.service';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-summary.component.html',
  styleUrl: './reservation-summary.component.css'
})
export class ReservationSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reservationService = inject(ReservationService);
  readonly reservationState = inject(ReservationStateService);
  readonly isPaying = signal(false);
  readonly paymentMessage = signal('');
  readonly paymentError = signal('');
  readonly paymentSuccessful = signal(false);

  constructor() {
    const reservationId = this.route.snapshot.paramMap.get('reservationId');
    if (reservationId) {
      this.reservationState.restoreFromStorage(reservationId);
    }
  }

  formatRemaining(): string {
    const total = this.reservationState.secondsRemaining();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  pay(): void {
    const reservationId = this.reservationState.reservationId();
    if (!reservationId || this.isPaying() || this.paymentSuccessful()) {
      return;
    }

    this.paymentMessage.set('');
    this.paymentError.set('');
    this.isPaying.set(true);

    this.reservationService.payReservation(reservationId).subscribe({
      next: (response) => {
        this.paymentSuccessful.set(true);
        this.paymentMessage.set(this.getBackendMessage(response) ?? 'Payment completed successfully.');
        this.isPaying.set(false);
        //void this.router.navigate(['/movies']);
      },
      error: (error) => {
        this.paymentError.set(this.getBackendMessage(error?.error ?? error) ?? 'Payment could not be completed. Please try again.');
        this.isPaying.set(false);
      }
    });
  }

  private getBackendMessage(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (value && typeof value === 'object') {
      const body = value as { message?: unknown; detail?: unknown; title?: unknown };
      for (const candidate of [body.message, body.detail, body.title]) {
        if (typeof candidate === 'string' && candidate.trim()) {
          return candidate.trim();
        }
      }
    }

    return null;
  }
}
