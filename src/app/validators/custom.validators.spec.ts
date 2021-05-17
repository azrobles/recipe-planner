import { FormControl } from "@angular/forms";
import { compareIdFn, idRequiredValidator } from "./custom.validators";

describe('idRequiredValidator', () => {
  const validatorFn = idRequiredValidator();
  const control = new FormControl('input');

  it('should return null if input id property is defined', () => {
    control.setValue({ id: 1 });
    expect(validatorFn(control)).toBeNull();
  });

  it('should return error object if input id property is not defined', () => {
    control.setValue({ id: undefined });
    expect(validatorFn(control)).toEqual({ idRequired: true });
  });
});

describe('compareIdFn', () => {
  const compareFn = compareIdFn;

  it('should return true if id properties are equal', () => {
    expect(compareFn({ id: 1 }, { id: 1 })).toBeTrue();
  });

  it('should return false if id properties are not equal', () => {
    expect(compareFn({ id: 1 }, { id: 2 })).toBeFalse();
  });
});
