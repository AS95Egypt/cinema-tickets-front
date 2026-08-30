export type HallType = 'Standard' | '4D' | 'Gold' | 'MAX' | 'IMAX';

export const HALL_TYPES: HallType[] = ['Standard', '4D', 'Gold', 'MAX', 'IMAX'];

export interface Hall {
  id: string;
  title: string;
  numberOfSeats: number;
  type: HallType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHallRequest {
  title: string;
  numberOfSeats: number;
  type: HallType;
}

export interface UpdateHallRequest {
  title: string;
  numberOfSeats: number;
  type: HallType;
}
