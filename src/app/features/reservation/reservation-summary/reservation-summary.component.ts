import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  readonly reservationState = inject(ReservationStateService);

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

  continue(): void {
    const reservationId = this.reservationState.reservationId();
    if (reservationId) {
      void this.router.navigate(['/checkout', reservationId]);
    }
  }
}
