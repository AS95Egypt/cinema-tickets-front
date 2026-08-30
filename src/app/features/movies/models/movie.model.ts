export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors?: string;
  trailerUrl?: string;
  isActive: boolean;
  posterUrl?: string;
}

export interface Screening {
  id: string;
  startDateTime: string;
  price: number;
  hall: {
    id: string;
    title: string;
    type: string;
  };
}

export interface MovieDetailsResponse {
  id: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  language: string;
  description: string;
  actors?: string;
  trailerUrl?: string;
  isActive: boolean;
  posterUrl?: string;
}

export interface ScreeningListResponse {
  screenings: Screening[];
}
