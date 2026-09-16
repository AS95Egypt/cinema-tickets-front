export interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  startDateTime: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningListItem {
  id: string;
  startDateTime: string;
  price: number;
  hall: {
    id: string;
    title: string;
    type: string;
  };
  movie: {
    id: string;
    title: string;
    duration: number;
  };
}

export interface ScreeningListResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  items: ScreeningListItem[];
}

export interface CreateScreeningRequest {
  hallId: string;
  startDateTime: string;
  price: number;
}

export interface ScreeningViewModel extends ScreeningListItem {
  movieTitle: string;
  hallName: string;
  hallType: string;
  isPast: boolean;
}
