import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ScreeningsComponent } from './screenings.component';

describe('ScreeningsComponent', () => {
  let fixture: ComponentFixture<ScreeningsComponent>;
  let component: ScreeningsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreeningsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreeningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });
});
