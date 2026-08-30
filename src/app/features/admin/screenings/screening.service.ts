import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { mapScreeningErrorMessage } from './screening-error.util';
import { CreateScreeningRequest, Screening } from './screening.models';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5193/api/v1/movies';

  getScreeningsForMovie(movieId: string): Observable<Screening[]> {
    return this.http.get<Screening[]>(`${this.baseUrl}/${movieId}/screenings`).pipe(this.handleError());
  }

  createScreening(movieId: string, request: CreateScreeningRequest): Observable<Screening> {
    return this.http.post<Screening>(`${this.baseUrl}/${movieId}/screenings`, request).pipe(this.handleError());
  }

  private handleError<T>() {
    return (source: Observable<T>): Observable<T> =>
      source.pipe(catchError((error: HttpErrorResponse) => throwError(() => new Error(mapScreeningErrorMessage(error)))));
  }
}
