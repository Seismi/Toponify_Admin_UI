import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from '@app/architecture/services/diagram-level.service';

@Pipe({ name: 'layer' })
export class LayerPipe implements PipeTransform {
  constructor() {}

  transform(
    items: any[],
    props?: { byId: boolean; descendantIds$?: Observable<string[]>; level?: Level }
  ): Observable<any[]> {
    if (!items || items.length < 1) {
      return of([]);
    }
    if (!props.byId) {
      return of(items);
    }

    if (props.level === Level.usage) {
      return of(items);
    }
    if ([Level.dataSetMap, Level.systemMap, Level.usage].includes(props.level)) {
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
