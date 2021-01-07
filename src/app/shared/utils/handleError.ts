import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function HandleHttpResponseError(error: HttpErrorResponse) {
  console.log(error);
  return throwError('mi mensaje de error');
}