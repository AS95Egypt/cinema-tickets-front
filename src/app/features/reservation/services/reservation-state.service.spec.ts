import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ReservationService } from './reservation.service';
import { ReservationStateService } from './reservation-state.service';

describe('ReservationStateService', () => {
  let service: ReservationStateService;
  let reservationApi: jasmine.SpyObj<ReservationService>;

  beforeEach(() => {
    reservationApi = jasmine.createSpyObj<ReservationService>('ReservationService', [
      'getSeatAvailability',
      'createReservation'
    ]);
    TestBed.configureTestingModule({ providers: [ReservationStateService, { provide: ReservationService, useValue: reservationApi }] });
    service = TestBed.inject(ReservationStateService);
  });

  it('derives held and available seats from seat availability', () => {
    service.seatAvailability.set({ screeningId: 'screening-1', numberOfSeats: 4, unavailableSeatNumbers: [2, 4] });

    expect(service.seats()).toEqual([
      { seatNumber: 1, state: 'available' },
      { seatNumber: 2, state: 'held' },
      { seatNumber: 3, state: 'available' },
      { seatNumber: 4, state: 'held' }
    ]);
  });

  it('selects and deselects only available seats', () => {
    service.seatAvailability.set({ screeningId: 'screening-1', numberOfSeats: 3, unavailableSeatNumbers: [2] });

    service.selectSeat(2);
    expect(service.selectedSeat()).toBeNull();
    service.selectSeat(1);
    expect(service.selectedSeat()).toBe(1);
    service.selectSeat(1);
    expect(service.selectedSeat()).toBeNull();
    service.selectSeat(3);
    service.deselectSeat();
    expect(service.selectedSeat()).toBeNull();
  });

  it('applies a successful hold and persists it', () => {
    service.setRouteContext('movie-1', 'screening-1', 100);
    service.seatAvailability.set({ screeningId: 'screening-1', numberOfSeats: 2 });
    service.selectSeat(1);
    const response = {
      reservationId: 'reservation-1',
      status: 'Held' as const,
      expiresAt: '2030-01-01T00:00:00Z',
      screeningId: 'screening-1',
      seatNo: 1,
      price: 120,
      currency: 'EGP'
    };
    reservationApi.createReservation.and.returnValue(of(response));

    service.createHold().subscribe();

    expect(service.reservationId()).toBe('reservation-1');
    expect(service.expiresAt()).toBe(response.expiresAt);
    expect(service.price()).toBe(120);
    expect(JSON.parse(sessionStorage.getItem('reservation.hold') ?? '{}')).toEqual({
      reservationId: 'reservation-1',
      screeningId: 'screening-1',
      expiresAt: response.expiresAt
    });
  });

  it('reports a conflict and reloads availability', () => {
    service.setRouteContext('movie-1', 'screening-1', 100);
    service.seatAvailability.set({ screeningId: 'screening-1', numberOfSeats: 2 });
    service.selectSeat(1);
    reservationApi.createReservation.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    reservationApi.getSeatAvailability.and.returnValue(of({ screeningId: 'screening-1', numberOfSeats: 2, unavailableSeatNumbers: [1] }));

    service.createHold().subscribe();

    expect(reservationApi.createReservation).toHaveBeenCalledWith({ screeningId: 'screening-1', seatNo: 1 });
    expect(service.conflictMessage()).toContain('no longer available');
    expect(reservationApi.getSeatAvailability).toHaveBeenCalledWith('screening-1');
    expect(service.seatAvailability()?.unavailableSeatNumbers).toEqual([1]);
  });

  it('marks a held reservation expired when its deadline passes', () => {
    service.reservationStatus.set('Held');
    service.expiresAt.set(new Date(Date.now() - 1000).toISOString());

    (service as unknown as { tick: () => void }).tick();

    expect(service.secondsRemaining()).toBe(0);
    expect(service.reservationStatus()).toBe('Expired');
  });

  afterEach(() => sessionStorage.clear());
});