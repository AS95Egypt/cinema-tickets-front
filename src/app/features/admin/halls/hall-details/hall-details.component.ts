import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HallService } from '../hall.service';
import { Hall } from '../hall.models';
import { mapHallErrorMessage } from '../hall-error.util';

@Component({
  selector: 'app-hall-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hall-details.component.html',
  styleUrl: './hall-details.component.css'
})
export class HallDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hallService = inject(HallService);
  private readonly destroyRef = inject(DestroyRef);

  readonly hall = signal<Hall | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    this.loadHall();
  }

  loadHall(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('The requested hall could not be found.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.hallService
      .getHall(id)
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

  back(): void {
    void this.router.navigate(['/admin/halls']);
  }

  edit(): void {
    const hall = this.hall();
    if (!hall) {
      return;
    }

    void this.router.navigate(['/admin/halls', hall.id, 'edit']);
  }

  toggleHall(): void {
    const hall = this.hall();
    if (!hall) {
      return;
    }

    const action = hall.isActive ? 'deactivate' : 'activate';
    const wasActive = hall.isActive;
    if (!window.confirm(`Are you sure you want to ${action} ${hall.title}?`)) {
      return;
    }

    const request$ = hall.isActive ? this.hallService.deactivateHall(hall.id) : this.hallService.activateHall(hall.id);
    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedHall) => {
        this.hall.update((current) =>
          current
            ? {
                ...current,
                isActive: updatedHall?.isActive ?? !wasActive,
                updatedAt: updatedHall?.updatedAt ?? current.updatedAt
              }
            : current
        );
        this.successMessage.set(wasActive ? `${hall.title} deactivated successfully.` : `${hall.title} activated successfully.`);
      },
      error: (error) => {
        this.error.set(mapHallErrorMessage(error));
      }
    });
  }
}
