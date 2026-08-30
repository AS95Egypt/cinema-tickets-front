import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';

describe('app routes', () => {
  const authServiceMock = {
    currentUser: jasmine.createSpy('currentUser').and.returnValue(null),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false),
    isAdmin: jasmine.createSpy('isAdmin').and.returnValue(false),
    logout: jasmine.createSpy('logout'),
    accessToken: jasmine.createSpy('accessToken').and.returnValue(null)
  };

  beforeEach(async () => {
    authServiceMock.currentUser.and.returnValue(null);
    authServiceMock.isAuthenticated.and.returnValue(false);
    authServiceMock.isAdmin.and.returnValue(false);
    authServiceMock.logout.calls.reset();

    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('redirects anonymous users to login from admin routes', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/admin');

    expect(harness.routeNativeElement?.textContent).toContain('Sign in');
  });

  it('redirects non-admin users to forbidden', async () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.currentUser.and.returnValue({
      id: '2',
      username: 'Guest',
      email: 'guest@example.com',
      isAdmin: false
    });

    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/admin');

    expect(harness.routeNativeElement?.textContent).toContain('Access denied');
  });

  it('renders the admin dashboard for admins', async () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.isAdmin.and.returnValue(true);
    authServiceMock.currentUser.and.returnValue({
      id: '1',
      username: 'Admin',
      email: 'admin@example.com',
      isAdmin: true
    });

    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/admin');

    const text = harness.routeNativeElement?.textContent ?? '';
    expect(text).toContain('Admin shortcuts');
    expect(text).toContain('Halls');
    expect(text).toContain('Movies');
    expect(text).toContain('Screenings');
  });
});
