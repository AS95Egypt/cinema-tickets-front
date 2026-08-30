import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['register', 'isAuthenticated', 'currentUser', 'isAdmin', 'accessToken']);
    authService.isAuthenticated.and.returnValue(false);
    authService.currentUser.and.returnValue(null);
    authService.isAdmin.and.returnValue(false);
    authService.accessToken.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('blocks invalid form submission', () => {
    component.submit();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('submits valid registration and redirects to login', () => {
    component.form.setValue({
      username: 'Alice',
      email: 'alice@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    authService.register.and.returnValue(of({}));

    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      Username: 'Alice',
      Email: 'alice@example.com',
      Password: 'Password123!'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('shows a duplicate email message on 409', () => {
    component.form.setValue({
      username: 'Alice',
      email: 'alice@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    authService.register.and.returnValue(throwError(() => ({ status: 409 })));

    component.submit();

    expect(component.errorMessage()).toBe('An account with this email already exists.');
  });
});
