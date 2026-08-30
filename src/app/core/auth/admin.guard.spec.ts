import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';

describe('adminGuard', () => {
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
  let authServiceSpy: any;

  beforeEach(() => {
    authServiceSpy = {
      isAuthenticated: () => false,
      isAdmin: () => false
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
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, { url: '/admin' } as never));
    expect(result).toBe(tree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/admin' } });
  });

  it('redirects non-admin users to forbidden', () => {
    authServiceSpy.isAuthenticated = () => true;
    authServiceSpy.isAdmin = () => false;
    const tree = {} as never;
    routerSpy.createUrlTree.and.returnValue(tree);
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, { url: '/admin' } as never));
    expect(result).toBe(tree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });

  it('treats a missing admin flag as forbidden', () => {
    authServiceSpy.isAuthenticated = () => true;
    authServiceSpy.isAdmin = () => undefined;
    const tree = {} as never;
    routerSpy.createUrlTree.and.returnValue(tree);
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, { url: '/admin' } as never));
    expect(result).toBe(tree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });

  it('allows admin users', () => {
    authServiceSpy.isAuthenticated = () => true;
    authServiceSpy.isAdmin = () => true;
    const result = TestBed.runInInjectionContext(() => adminGuard({} as never, { url: '/admin' } as never));
    expect(result).toBeTrue();
  });
});
