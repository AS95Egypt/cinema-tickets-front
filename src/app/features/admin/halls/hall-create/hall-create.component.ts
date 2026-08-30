import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HallFormComponent } from '../hall-form/hall-form.component';
import { HallService } from '../hall.service';
import { mapHallErrorMessage } from '../hall-error.util';
import { CreateHallRequest } from '../hall.models';

@Component({
  selector: 'app-hall-create',
  standalone: true,
  imports: [CommonModule, RouterLink, HallFormComponent],
  templateUrl: './hall-create.component.html',
  styleUrl: './hall-create.component.css'
})
export class HallCreateComponent {
  private readonly hallService = inject(HallService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly serverError = signal<string | null>(null);
  readonly submitting = signal(false);

  submitForm(payload: CreateHallRequest): void {
    this.serverError.set(null);
    this.submitting.set(true);

    this.hallService
      .createHall(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin/halls'], {
            state: { successMessage: `${payload.title} created successfully.` }
          });
        },
        error: (error) => {
          this.serverError.set(mapHallErrorMessage(error));
          this.submitting.set(false);
        }
      });
  }
}
