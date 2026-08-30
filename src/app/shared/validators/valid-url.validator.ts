import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    const value = typeof rawValue === 'string' ? rawValue.trim() : '';

    if (!value) {
      return null;
    }

    try {
      const parsed = new URL(value);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { invalidUrl: true };
      }
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}
