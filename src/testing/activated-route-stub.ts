import { convertToParamMap, ParamMap, Params } from "@angular/router";
import { ReplaySubject } from "rxjs";

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
 export class ActivatedRouteStub {
  private _paramMap?: ParamMap;
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  readonly paramMap = this.subject.asObservable();

  setParamMap(params: Params = {}) {
    this._paramMap = convertToParamMap(params);
    this.subject.next(convertToParamMap(params));
  }

  get snapshot() {
    return { paramMap: this._paramMap };
  }
}
