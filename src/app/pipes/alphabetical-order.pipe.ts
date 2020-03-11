import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class AlphabeticalOrderPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    return array.slice().sort((a, b) => a[field].toLowerCase() !== b[field].toLowerCase() ? a[field].toLowerCase() < b[field].toLowerCase() ? -1 : 1 : 0);
  }

}