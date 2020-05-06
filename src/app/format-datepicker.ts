import { NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    let result = date.toDateString();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    switch (displayFormat) {
      case 'DD/MM/YYYY':
        // Return the format as per your requirement
        result = `${day}/${month}/${year}`;
        break;
      default:
      case 'MMM YYYY':
        // Return the format as per your requirement
        result = `${month}-${year}`;
        break;
    }
    return result;
  }
  parse(value: string): any {
    const parts = value.split('/');
    if (parts.length === 3) {
      return new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
