import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
  let authServiceSpy: any;

  beforeEach(() => {
    authServiceSpy = {
      isAuthenticated: () => false
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  it('redirects unauthenticated users to login', () => {
    const tree = {} as never;
    routerSpy.createUrlTree.and.returnValue(tree);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/movies' } as never));
    expect(result).toBe(tree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/movies' } });
  });

  it('allows authenticated users', () => {
    authServiceSpy.isAuthenticated = () => true;
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, { url: '/movies' } as never));
    expect(result).toBeTrue();
  });
});
