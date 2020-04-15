import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from '@app/architecture/services/diagram-level.service';

@Pipe({ name: 'layer' })
export class LayerPipe implements PipeTransform {
  constructor() {}

  transform(
    items: any[],
    props?: { byId: boolean; descendantIds$?: Observable<string[]>; groupMemberIds$?: Observable<string[]>;  level?: Level }
  ): Observable<any[]> {
    if (!items || items.length < 1) {
      return of([]);
    }
    if (!props.byId) {
      return of(items);
    }

    if (props.level.endsWith('map') || props.level === Level.usage) {
      return of(items);
    }

    const filterNodeIds$ = props.level === Level.system ?
      props.groupMemberIds$ : props.descendantIds$;

    return filterNodeIds$.pipe(
      map(filterNodeIds => {
        if (filterNodeIds.length > 0) {
          return items.filter(item => filterNodeIds.some(id => id === item.id));
        } else {
          if (props.byId) {
            return [];
          } else {
            return items;
          }
        }
      })
    );
  }
}
