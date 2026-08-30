import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HallsComponent } from './halls.component';

describe('HallsComponent', () => {
  let fixture: ComponentFixture<HallsComponent>;
  let component: HallsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });
});
