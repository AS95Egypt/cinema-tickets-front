import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { email, password } = this.form.getRawValue();

    this.authService
      .login({ Email: email ?? '', Password: password ?? '' })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const destination = this.returnUrl
            ? this.returnUrl
            : this.authService.isAdmin()
              ? '/admin'
              : '/movies';
          void this.router.navigateByUrl(destination);
        },
        error: (error) => {
          const status = error?.status as number | undefined;
          this.errorMessage.set(status === 401 ? 'Invalid email or password.' : 'Something went wrong. Please try again later.');
        }
      });
  }
}
