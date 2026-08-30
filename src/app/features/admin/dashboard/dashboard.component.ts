import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardCard {
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly cards: DashboardCard[] = [
    {
      title: 'Halls',
      description: 'Review cinema halls, seating layouts, and hall-level settings.',
      link: '/admin/halls'
    },
    {
      title: 'Movies',
      description: 'Manage the active movie catalog and editorial content.',
      link: '/admin/movies'
    },
    {
      title: 'Screenings',
      description: 'Organize screening schedules and hall assignments.',
      link: '/admin/screenings'
    }
  ];
}
