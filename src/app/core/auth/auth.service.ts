import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthenticatedUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

export interface StoredSession {
  accessToken: string;
  user: AuthenticatedUser;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly STORAGE_KEY = 'auth.session';

  private readonly api = inject(AuthApiService);
  private readonly accessTokenSig = signal<string | null>(null);
  private readonly currentUserSig = signal<AuthenticatedUser | null>(null);

  readonly accessToken = this.accessTokenSig.asReadonly();
  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.accessTokenSig() !== null);
  readonly isAdmin = computed(() => this.currentUserSig()?.isAdmin ?? false);

  constructor() {
    this.restoreSession();
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.api.login(payload).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => throwError(() => error))
    );
  }

  register(payload: RegisterRequest): Observable<unknown> {
    return this.api.register(payload);
  }

  logout(): void {
    this.accessTokenSig.set(null);
    this.currentUserSig.set(null);
    localStorage.removeItem(AuthService.STORAGE_KEY);
    // TODO: Consider cross-tab logout sync via storage events if the app grows beyond a single tab workflow.
  }

  private setSession(response: LoginResponse): void {
    const stored: StoredSession = {
      accessToken: response.accessToken,
      user: response.user,
      expiresAt: Date.now() + response.expiresIn * 1000
    };

    this.accessTokenSig.set(stored.accessToken);
    this.currentUserSig.set(stored.user);
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(stored));
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(AuthService.STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const stored = JSON.parse(raw) as Partial<StoredSession>;
      if (
        typeof stored.accessToken === 'string' &&
        stored.user !== undefined &&
        typeof stored.expiresAt === 'number' &&
        stored.expiresAt > Date.now()
      ) {
        this.accessTokenSig.set(stored.accessToken);
        this.currentUserSig.set(stored.user as AuthenticatedUser);
        return;
      }
    } catch {
      // Invalid storage payload falls through to cleanup.
    }

    localStorage.removeItem(AuthService.STORAGE_KEY);
  }
}
