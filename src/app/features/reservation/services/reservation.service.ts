import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReservationRequest, ReservationResponse, SeatAvailabilityResponse } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5193/api/v1';

  getSeatAvailability(
    screeningId: string,
  ): Observable<SeatAvailabilityResponse> {
    return this.http.get<SeatAvailabilityResponse>(
      `${this.apiUrl}/screenings/${screeningId}/seats`,
    );
  }

  createReservation(
    request: CreateReservationRequest,
  ): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(
      `${this.apiUrl}/reservations`,
      request,
    );
  }
}
