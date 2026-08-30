import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { mapMovieErrorMessage } from './movie-error.util';
import { CreateMovieRequest, Movie, UpdateMovieRequest } from './movie.models';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5193/api/v1/movies';

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl).pipe(this.handleError());
  }

  getActiveMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/active`).pipe(this.handleError());
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/${id}`).pipe(this.handleError());
  }

  createMovie(payload: CreateMovieRequest): Observable<Movie> {
    return this.http.post<Movie>(this.baseUrl, payload).pipe(this.handleError());
  }

  updateMovie(id: string, payload: UpdateMovieRequest): Observable<Movie> {
    return this.http.put<Movie>(`${this.baseUrl}/${id}`, payload).pipe(this.handleError());
  }

  deactivateMovie(id: string): Observable<Movie> {
    return this.http.patch<Movie>(`${this.baseUrl}/${id}/deactivate`, {}).pipe(this.handleError());
  }

  activateMovie(id: string): Observable<Movie> {
    return this.http.patch<Movie>(`${this.baseUrl}/${id}/activate`, {}).pipe(this.handleError());
  }

  private handleError<T>() {
    return (source: Observable<T>): Observable<T> =>
      source.pipe(
        catchError((error: HttpErrorResponse) => throwError(() => new Error(mapMovieErrorMessage(error))))
      );
  }
}
