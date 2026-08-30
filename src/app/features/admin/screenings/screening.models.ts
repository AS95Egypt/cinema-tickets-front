export interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  startDateTime: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScreeningRequest {
  hallId: string;
  startDateTime: string;
  price: number;
}

export interface ScreeningViewModel extends Screening {
  movieTitle: string;
  hallName: string;
  hallType: string;
  isPast: boolean;
}
