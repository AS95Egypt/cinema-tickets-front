import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateHallRequest, Hall, UpdateHallRequest } from './hall.models';

@Injectable({ providedIn: 'root' })
export class HallService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5193/api/v1/halls';

  getHalls(): Observable<Hall[]> {
    return this.http.get<Hall[]>(this.baseUrl);
  }

  getHall(id: string): Observable<Hall> {
    return this.http.get<Hall>(`${this.baseUrl}/${id}`);
  }

  createHall(request: CreateHallRequest): Observable<Hall> {
    return this.http.post<Hall>(this.baseUrl, request);
  }

  updateHall(id: string, request: UpdateHallRequest): Observable<Hall> {
    return this.http.put<Hall>(`${this.baseUrl}/${id}`, request);
  }

  deactivateHall(id: string): Observable<Hall> {
    return this.http.patch<Hall>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  activateHall(id: string): Observable<Hall> {
    return this.http.patch<Hall>(`${this.baseUrl}/${id}/activate`, {});
  }
}
