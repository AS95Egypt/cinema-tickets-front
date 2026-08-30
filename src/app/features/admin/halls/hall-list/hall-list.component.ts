import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HallService } from '../hall.service';
import { Hall } from '../hall.models';
import { mapHallErrorMessage } from '../hall-error.util';

type HallFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-hall-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hall-list.component.html',
  styleUrl: './hall-list.component.css'
})
export class HallListComponent implements OnInit {
  private readonly hallService = inject(HallService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly halls = signal<Hall[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly filter = signal<HallFilter>('all');

  readonly filteredHalls = computed(() => {
    const filter = this.filter();
    const halls = this.halls();

    if (filter === 'active') {
      return halls.filter((hall) => hall.isActive);
    }

    if (filter === 'inactive') {
      return halls.filter((hall) => !hall.isActive);
    }

    return halls;
  });

  ngOnInit(): void {
    const message = history.state?.successMessage;
    if (typeof message === 'string' && message.trim()) {
      this.successMessage.set(message);
    }
    this.loadHalls();
  }

  loadHalls(): void {
    this.loading.set(true);
    this.error.set(null);

    this.hallService
      .getHalls()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (halls) => {
          this.halls.set(halls);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(mapHallErrorMessage(error));
          this.loading.set(false);
        }
      });
  }

  setFilter(filter: HallFilter): void {
    this.filter.set(filter);
  }

  createHall(): void {
    void this.router.navigate(['/admin/halls/create']);
  }

  viewHall(id: string): void {
    void this.router.navigate(['/admin/halls', id]);
  }

  editHall(id: string): void {
    void this.router.navigate(['/admin/halls', id, 'edit']);
  }

  toggleHall(hall: Hall): void {
    const action = hall.isActive ? 'deactivate' : 'activate';
    const wasActive = hall.isActive;
    const confirmation = window.confirm(`Are you sure you want to ${action} ${hall.title}?`);
    if (!confirmation) {
      return;
    }

    const request$ = hall.isActive ? this.hallService.deactivateHall(hall.id) : this.hallService.activateHall(hall.id);
    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updatedHall) => {
        this.halls.update((current) =>
          current.map((item) =>
            item.id === hall.id
              ? {
                  ...item,
                  isActive: updatedHall?.isActive ?? !wasActive,
                  updatedAt: updatedHall?.updatedAt ?? item.updatedAt
                }
              : item
          )
        );
        this.successMessage.set(wasActive ? `${hall.title} deactivated successfully.` : `${hall.title} activated successfully.`);
      },
      error: (error) => {
        this.error.set(mapHallErrorMessage(error));
      }
    });
  }
}
