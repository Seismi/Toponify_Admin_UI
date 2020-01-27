import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'layer' })
export class LayerPipe implements PipeTransform {
  constructor() {}

  transform(items: any[], props?: { byId: boolean; descendantIds$?: Observable<string[]> }): Observable<any[]> {
    if (!items || items.length < 1) {
      return of([]);
    }
    if (!props.byId) {
      return of(items);
    }

    return props.descendantIds$.pipe(
      map(descendantIds => {
        if (!descendantIds.length) {
          return items;
        } else {
          return items.filter(item => descendantIds.some(id => id === item.id));
        }
      })
    );
  }
}
