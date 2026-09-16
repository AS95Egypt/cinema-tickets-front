import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('gets seat availability for a screening', () => {
    const response = { screeningId: 'screening-1', numberOfSeats: 20, unavailableSeatNumbers: [3], price: 120 };

    service.getSeatAvailability('screening-1').subscribe((result) => expect(result).toEqual(response));

    const request = httpMock.expectOne('http://localhost:5193/api/v1/screenings/screening-1/seats');
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('posts a reservation request', () => {
    const requestBody = { screeningId: 'screening-1', seatNo: 4 };
    const response = {
      reservationId: 'reservation-1',
      status: 'Held' as const,
      expiresAt: '2030-01-01T00:00:00Z',
      screeningId: 'screening-1',
      seatNo: 4,
      currency: 'EGP'
    };

    service.createReservation(requestBody).subscribe((result) => expect(result).toEqual(response));

    const request = httpMock.expectOne('http://localhost:5193/api/v1/reservations');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(requestBody);
    request.flush(response);
  });

  it('pays a reservation', () => {
    service.payReservation('reservation-1').subscribe();

    const request = httpMock.expectOne('http://localhost:5193/api/v1/reservations/reservation-1/pay');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({});
    request.flush({ message: 'Paid' });
  });
});