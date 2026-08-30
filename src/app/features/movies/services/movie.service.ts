import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, MovieDetailsResponse, Screening } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  // TODO make base url public var
  private readonly apiUrl = 'http://localhost:5193/api/v1/movies';

  getActiveMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/active`);
  }

  getMovieDetails(movieId: string): Observable<MovieDetailsResponse> {
    return this.http.get<MovieDetailsResponse>(`${this.apiUrl}/${movieId}`);
  }

  getScreenings(movieId: string): Observable<Screening[]> {
    return this.http.get<Screening[]>(`${this.apiUrl}/${movieId}/screenings`);
  }
}
