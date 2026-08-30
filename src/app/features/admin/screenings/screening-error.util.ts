import { HttpErrorResponse } from '@angular/common/http';

export function mapScreeningErrorMessage(error: unknown): string {
  const status = error instanceof HttpErrorResponse ? error.status : (error as { status?: number } | null | undefined)?.status;

  switch (status) {
    case 400:
      return 'Please check the screening details and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to manage screenings.';
    case 404:
      return 'The selected movie or hall could not be found.';
    case 409:
      return 'This hall is already occupied during the selected time. Please choose another hall or time.';
    case 500:
    default:
      return 'Something went wrong. Please try again later.';
  }
}
