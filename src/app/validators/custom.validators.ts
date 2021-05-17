import { AbstractControl, ValidatorFn } from '@angular/forms';

export function idRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const id = control.value?.id;
    return !id ? {idRequired: true} : null;
  };
}

export function compareIdFn(c1: any, c2: any): boolean {
  return c1 && c2 ? c1.id === c2.id : c1 === c2;
}
