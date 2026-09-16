import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { reservationGuard } from './reservation.guard';

describe('reservationGuard', () => {
  it('redirects anonymous users while preserving the target URL', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    const auth = { isAuthenticated: () => false };
    const tree = {} as never;
    router.createUrlTree.and.returnValue(tree);
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }, { provide: AuthService, useValue: auth }] });

    const result = TestBed.runInInjectionContext(() => reservationGuard({} as never, { url: '/movies/m1/screenings/s1/seats' } as never));

    expect(result).toBe(tree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/movies/m1/screenings/s1/seats' } });
  });

  it('allows authenticated users', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    const auth = { isAuthenticated: () => true };
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }, { provide: AuthService, useValue: auth }] });

    const result = TestBed.runInInjectionContext(() => reservationGuard({} as never, { url: '/reservations/r1' } as never));

    expect(result).toBeTrue();
  });
});