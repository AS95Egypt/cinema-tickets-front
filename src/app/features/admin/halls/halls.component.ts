import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-halls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './halls.component.html',
  styleUrl: './halls.component.css'
})
export class HallsComponent {}
