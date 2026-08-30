import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { matchFieldValidator } from '../../../shared/validators/match-field.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly form = this.fb.group(
    {
      username: ['', [Validators.required, Validators.pattern(/\S+/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: matchFieldValidator('password', 'confirmPassword') }
  );

  submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { username, email, password } = this.form.getRawValue();

    this.authService
      .register({ Username: username ?? '', Email: email ?? '', Password: password ?? '' })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Registration successful. Redirecting to login...');
          void this.router.navigate(['/login']);
        },
        error: (error) => {
          const status = error?.status as number | undefined;
          if (status === 409) {
            this.errorMessage.set('An account with this email already exists.');
            return;
          }

          if (status === 400 && error?.error && typeof error.error === 'object' && !Array.isArray(error.error)) {
            const message = Object.values(error.error)
              .flat()
              .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
              .join(' ');
            this.errorMessage.set(message || 'Please check your registration details.');
            return;
          }

          this.errorMessage.set('Something went wrong. Please try again later.');
        }
      });
  }
}
