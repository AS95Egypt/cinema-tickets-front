import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const source = control.get(controlName);
    const match = control.get(matchingControlName);

    if (!source || !match) {
      return null;
    }

    if (match.errors && !match.errors['fieldMismatch']) {
      return null;
    }

    if (source.value !== match.value) {
      match.setErrors({ ...(match.errors ?? {}), fieldMismatch: true });
      return { fieldMismatch: true };
    }

    if (match.errors?.['fieldMismatch']) {
      const { fieldMismatch, ...rest } = match.errors;
      match.setErrors(Object.keys(rest).length ? rest : null);
    }

    return null;
  };
}
