import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HallFormComponent } from '../hall-form/hall-form.component';
import { Hall } from '../hall.models';
import { HallService } from '../hall.service';
import { mapHallErrorMessage } from '../hall-error.util';

@Component({
  selector: 'app-hall-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, HallFormComponent],
  templateUrl: './hall-edit.component.html',
  styleUrl: './hall-edit.component.css'
})
export class HallEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hallService = inject(HallService);
  private readonly destroyRef = inject(DestroyRef);

  readonly hall = signal<Hall | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly serverError = signal<string | null>(null);
  readonly submitting = signal(false);

  private hallId: string | null = null;

  ngOnInit(): void {
    this.hallId = this.route.snapshot.paramMap.get('id');
    if (!this.hallId) {
      this.error.set('The requested hall could not be found.');
      this.loading.set(false);
      return;
    }

    this.loadHall();
  }

  loadHall(): void {
    if (!this.hallId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.hallService
      .getHall(this.hallId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (hall) => {
          this.hall.set(hall);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(mapHallErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  submitForm(payload: { title: string; numberOfSeats: number; type: Hall['type'] }): void {
    if (!this.hallId) {
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    this.hallService
      .updateHall(this.hallId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin/halls'], {
            state: { successMessage: `${payload.title} updated successfully.` }
          });
        },
        error: (error) => {
          this.serverError.set(mapHallErrorMessage(error));
          this.submitting.set(false);
        }
      });
  }
}
