import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ReservationService } from '../services/reservation.service';
import { ReservationStateService } from '../services/reservation-state.service';
import { ReservationSummaryComponent } from './reservation-summary.component';

describe('ReservationSummaryComponent', () => {
  let fixture: ComponentFixture<ReservationSummaryComponent>;
  let component: ReservationSummaryComponent;
  let state: any;
  let reservationApi: jasmine.SpyObj<ReservationService>;

  beforeEach(async () => {
    state = {
      reservationId: signal('reservation-1'),
      reservationStatus: signal<'Held' | 'Expired'>('Held'),
      movieId: signal('movie-1'),
      screeningId: signal('screening-1'),
      price: signal(120),
      secondsRemaining: signal(125),
      restoreFromStorage: jasmine.createSpy('restoreFromStorage')
    };
    reservationApi = jasmine.createSpyObj<ReservationService>('ReservationService', ['payReservation']);
    reservationApi.payReservation.and.returnValue(of({ message: 'Payment received' }));

    await TestBed.configureTestingModule({
      imports: [ReservationSummaryComponent],
      providers: [
        { provide: ReservationStateService, useValue: state },
        { provide: ReservationService, useValue: reservationApi },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['reservationId', 'reservation-1']]) } } }
      ]
    }).compileComponents();
    spyOn(TestBed.inject(Router), 'navigate');
    fixture = TestBed.createComponent(ReservationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('formats the remaining hold time as MM:SS', () => {
    expect(component.formatRemaining()).toBe('02:05');
    expect(state.restoreFromStorage).toHaveBeenCalledWith('reservation-1');
  });

  it('pays the held reservation and shows the backend message', () => {
    component.pay();
    fixture.detectChanges();

    expect(reservationApi.payReservation).toHaveBeenCalledWith('reservation-1');
    expect(component.paymentSuccessful()).toBeTrue();
    expect(component.paymentMessage()).toBe('Payment received');
  });

  it('shows the expired state and links back to seat selection', () => {
    state.reservationStatus.set('Expired');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your seat hold has expired. Please select your seat again.');
    expect(fixture.nativeElement.querySelector('.secondary-link').getAttribute('href')).toBe('/movies/movie-1/screenings/screening-1/seats');
  });
});