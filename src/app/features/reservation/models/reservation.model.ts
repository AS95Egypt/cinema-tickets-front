export interface SeatAvailabilityResponse {
  screeningId: string;
  numberOfSeats?: number;
  hall?: {
    id: string;
    title: string;
    numberOfSeats: number;
  };
  unavailableSeatNumbers?: number[];
  price?: number;
  seats?: Array<{
    seatNo?: number;
    seatNumber?: number;
    status?: 'AVAILABLE' | 'RESERVED' | 'HELD' | 'SELECTED';
    state?: SeatState;
  }>;
}

export type SeatState = 'available' | 'selected' | 'held' | 'reserved';

export interface CreateReservationRequest {
  screeningId: string;
  seatNo: number;
}

export type ReservationStatus = 'Held' | 'Expired' | 'Cancelled' | 'Confirmed';

export interface ReservationResponse {
  reservationId: string;
  status: ReservationStatus;
  expiresAt: string;
  screeningId: string;
  seatNo: number;
  price?: number;
  currency: string;
}
