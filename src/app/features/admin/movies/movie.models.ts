export type MovieGenre = 'Comedy' | 'Action' | 'Drama' | 'Fantasy';

// TODO: Keep this in sync with backend-supported genres until the API exposes a genre lookup endpoint.
export const MOVIE_GENRES: MovieGenre[] = ['Comedy', 'Action', 'Drama', 'Fantasy'];

export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors: string;
  trailerUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovieFormValue {
  title: string;
  genre: MovieGenre | '';
  duration: number | null;
  releaseDate: string;
  language: string;
  description: string;
  actors: string;
  trailerUrl: string;
}

export interface CreateMovieRequest {
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors: string;
  trailerUrl?: string;
}

export type UpdateMovieRequest = CreateMovieRequest;
