import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'isAdmin']);
    authService.isAuthenticated.and.returnValue(false);
    authService.isAdmin.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('blocks invalid form submission', () => {
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('navigates to movies for a normal user', () => {
    component.form.setValue({ email: 'alice@example.com', password: 'Password123!' });
    authService.login.and.returnValue(of({ accessToken: 't', expiresIn: 3600, user: { id: '1', username: 'A', email: 'alice@example.com', isAdmin: false } }));

    component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/movies');
  });

  it('navigates to admin for an admin user', () => {
    component.form.setValue({ email: 'alice@example.com', password: 'Password123!' });
    authService.isAdmin.and.returnValue(true);
    authService.login.and.returnValue(of({ accessToken: 't', expiresIn: 3600, user: { id: '1', username: 'A', email: 'alice@example.com', isAdmin: true } }));

    component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('shows invalid credentials on 401', () => {
    component.form.setValue({ email: 'alice@example.com', password: 'badpass' });
    authService.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.submit();

    expect(component.errorMessage()).toBe('Invalid email or password.');
  });
});
