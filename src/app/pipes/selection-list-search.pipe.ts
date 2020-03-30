import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'selectionListSearch' })
export class SelectionListSearchPipe implements PipeTransform {
  transform(value: any[], args?: string): any {
    if (!value) {
      return null;
    }

    if (!args) {
      return value;
    }

    args = args.toLowerCase();

    return value.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}
