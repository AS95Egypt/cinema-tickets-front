import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AdminLayoutComponent } from './admin-layout.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('AdminLayoutComponent', () => {
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let component: AdminLayoutComponent;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['logout', 'currentUser']);
    authService.currentUser.and.returnValue({
      id: '1',
      username: 'Admin',
      email: 'admin@example.com',
      isAdmin: true
    });

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the admin navigation and user info', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Admin');
    expect(compiled.textContent).toContain('admin@example.com');
    expect(compiled.textContent).toContain('Dashboard');
    expect(compiled.textContent).toContain('Halls');
    expect(compiled.textContent).toContain('Movies');
    expect(compiled.textContent).toContain('Screenings');
  });

  it('logs out and navigates to login', () => {
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
