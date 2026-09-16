import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { SeatSelectionComponent } from './seat-selection.component';
import { ReservationStateService } from '../services/reservation-state.service';

describe('SeatSelectionComponent', () => {
  let fixture: ComponentFixture<SeatSelectionComponent>;
  let component: SeatSelectionComponent;
  let state: any;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    state = {
      movieId: signal('movie-1'),
      screeningId: signal('screening-1'),
      selectedSeat: signal<number | null>(null),
      isLoading: signal(false),
      errorMessage: signal(''),
      conflictMessage: signal(''),
      price: signal(100),
      seatAvailability: signal({ screeningId: 'screening-1', numberOfSeats: 4, unavailableSeatNumbers: [2] }),
      seats: signal([
        { seatNumber: 1, state: 'available' },
        { seatNumber: 2, state: 'held' },
        { seatNumber: 3, state: 'available' },
        { seatNumber: 4, state: 'available' }
      ]),
      setRouteContext: jasmine.createSpy('setRouteContext'),
      loadSeatAvailability: jasmine.createSpy('loadSeatAvailability').and.returnValue(of({})),
      selectSeat: jasmine.createSpy('selectSeat').and.callFake((seatNumber: number) => state.selectedSeat.set(seatNumber)),
      createHold: jasmine.createSpy('createHold').and.returnValue(of({ reservationId: 'reservation-1' }))
    };
    await TestBed.configureTestingModule({
      imports: [SeatSelectionComponent],
      providers: [
        { provide: ReservationStateService, useValue: state },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['movieId', 'movie-1'], ['screeningId', 'screening-1']]), queryParamMap: new Map() } } }
      ]
    }).compileComponents();
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'navigate');
    fixture = TestBed.createComponent(SeatSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders available and blocked seats and disables continue without a selection', () => {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('.seat')) as HTMLButtonElement[];

    expect(buttons[0].classList).toContain('available');
    expect(buttons[1].disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.continue-button').disabled).toBeTrue();
  });

  it('selects an available seat and submits the hold', () => {
    component.selectSeat(1);
    fixture.detectChanges();
    expect(state.selectSeat).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.querySelector('.continue-button').disabled).toBeFalse();

    component.continue();

    expect(state.createHold).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/reservations', 'reservation-1']);
  });
});