import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthApiService } from './auth-api.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const loginResponse = {
    accessToken: 'token-123',
    expiresIn: 3600,
    user: { id: '1', username: 'Alice', email: 'alice@example.com', isAdmin: true }
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService, AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('restores a valid session', () => {
    localStorage.setItem(
      'auth.session',
      JSON.stringify({ accessToken: 'restored', user: loginResponse.user, expiresAt: Date.now() + 10000 })
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService, AuthService]
    });
    const restored = TestBed.inject(AuthService);
    expect(restored.isAuthenticated()).toBeTrue();
    expect(restored.accessToken()).toBe('restored');
    expect(restored.currentUser()?.email).toBe('alice@example.com');
  });

  it('clears an expired session', () => {
    localStorage.setItem(
      'auth.session',
      JSON.stringify({ accessToken: 'expired', user: loginResponse.user, expiresAt: Date.now() - 1000 })
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService, AuthService]
    });
    const restored = TestBed.inject(AuthService);
    expect(restored.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('auth.session')).toBeNull();
  });

  it('clears a corrupted session', () => {
    localStorage.setItem('auth.session', '{bad json');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApiService, AuthService]
    });
    const restored = TestBed.inject(AuthService);
    expect(restored.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('auth.session')).toBeNull();
  });

  it('login updates auth state and storage', () => {
    service.login({ Email: 'alice@example.com', Password: 'Password123!' }).subscribe();
    const req = httpMock.expectOne('http://localhost:5193/api/v1/auth/login');
    req.flush(loginResponse);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.isAdmin()).toBeTrue();
    expect(service.accessToken()).toBe('token-123');
    expect(JSON.parse(localStorage.getItem('auth.session') ?? '{}').accessToken).toBe('token-123');
  });

  it('register does not mutate auth state', () => {
    service.register({ Username: 'Alice', Email: 'alice@example.com', Password: 'Password123!' }).subscribe();
    const req = httpMock.expectOne('http://localhost:5193/api/v1/auth/register');
    req.flush({});

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.accessToken()).toBeNull();
  });

  it('logout clears storage and state', () => {
    service.login({ Email: 'alice@example.com', Password: 'Password123!' }).subscribe();
    httpMock.expectOne('http://localhost:5193/api/v1/auth/login').flush(loginResponse);

    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('auth.session')).toBeNull();
  });
});
