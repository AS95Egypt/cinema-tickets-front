import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { mapScreeningErrorMessage } from './screening-error.util';
import { CreateScreeningRequest, Screening, ScreeningListResponse } from './screening.models';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5193/api/v1/movies';
  private readonly screeningsUrl = 'http://localhost:5193/api/v1/screenings/all';

  getScreenings(page: number, pageSize: number, movieId?: string, hallId?: string): Observable<ScreeningListResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (movieId) {
      params = params.set('movieId', movieId);
    }
    if (hallId) {
      params = params.set('hallId', hallId);
    }

    return this.http.get<ScreeningListResponse>(this.screeningsUrl, { params }).pipe(this.handleError());
  }

  createScreening(movieId: string, request: CreateScreeningRequest): Observable<Screening> {
    return this.http.post<Screening>(`${this.baseUrl}/${movieId}/screenings`, request).pipe(this.handleError());
  }

  private handleError<T>() {
    return (source: Observable<T>): Observable<T> =>
      source.pipe(catchError((error: HttpErrorResponse) => throwError(() => new Error(mapScreeningErrorMessage(error)))));
  }
}
