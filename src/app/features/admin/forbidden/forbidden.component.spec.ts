import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ForbiddenComponent } from './forbidden.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('ForbiddenComponent', () => {
  let fixture: ComponentFixture<ForbiddenComponent>;
  let component: ForbiddenComponent;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated']);
    authService.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the access denied message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Access denied');
    expect(compiled.textContent).toContain('You do not have permission to view this page.');
  });

  it('logs out when the logout button is clicked', () => {
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
