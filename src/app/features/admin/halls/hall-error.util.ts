import { HttpErrorResponse } from '@angular/common/http';

function backendMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body || typeof body !== 'object') {
    return null;
  }

  const message = (body as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message.trim();
  }

  return null;
}

export function mapHallErrorMessage(error: unknown): string {
  const status = error instanceof HttpErrorResponse ? error.status : (error as { status?: number } | null | undefined)?.status;
  const friendlyMessage = error instanceof HttpErrorResponse ? backendMessage(error) : null;

  switch (status) {
    case 400:
      return friendlyMessage ?? 'The hall details entered are invalid. Please check the form and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to manage cinema halls.';
    case 404:
      return 'The requested hall could not be found.';
    case 409:
      return friendlyMessage ?? 'This hall could not be saved because of a conflict with existing data.';
    default:
      return 'Something went wrong. Please try again later.';
  }
}
