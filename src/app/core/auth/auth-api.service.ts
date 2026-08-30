import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  //private readonly baseUrl = '/api/auth';
  private readonly baseUrl = 'http://localhost:5193/api/v1';

  register(payload: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }
}
