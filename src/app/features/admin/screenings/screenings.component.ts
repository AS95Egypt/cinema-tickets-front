import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-screenings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './screenings.component.html',
  styleUrl: './screenings.component.css'
})
export class ScreeningsComponent {}
