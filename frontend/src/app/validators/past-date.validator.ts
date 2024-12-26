import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return inputDate < today ? { pastDate: true }:null;
  };
}

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setFullYear(today.getFullYear() + 100);
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? { invalidDate: true }:null;
  };
}

