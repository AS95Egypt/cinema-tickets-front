import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MoviesComponent } from './movies.component';

describe('MoviesComponent', () => {
  let fixture: ComponentFixture<MoviesComponent>;
  let component: MoviesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });
});
