import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

export function toHttpParams(obj: Object): HttpParams {
  let httpParams = new HttpParams();
  Object.getOwnPropertyNames(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        httpParams = httpParams.append(`${key}[]`, item);
      });
    } else {
      httpParams = httpParams.set(key, obj[key]);
    }
  });
  return httpParams;
}

export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}
