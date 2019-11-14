import { Pipe, PipeTransform } from '@angular/core';
import { Level } from '../services/diagram-level.service';
import { Params } from '@angular/router';

@Pipe({ name: 'layer' })
export class LayerPipe implements PipeTransform {
  constructor() {}

  transform(items: any[], props?: { byId: boolean; params: Params }): any {
    if (!items || items.length < 1) {
      return [];
    }

    const { filterLevel, id } = props.params;

    if (!filterLevel) {
      return items;
    }

    // If current layer map or usage, do not filter
    if ([Level.dataSetMap, Level.systemMap, Level.usage].includes(filterLevel)) {
      return items;
    } else {
      const filteredItems = items.filter(item => item.layer === filterLevel.toLowerCase());
      // Sorting by id is optional
      if (props && props.byId && id) {
        const parentNode = items.find(item => item.id === id);
        if (!parentNode) {
          return [];
        }
        const childNodeIds = parentNode.descendants.map(item => item.id);
        return filteredItems.filter(item => childNodeIds.includes(item.id));
      }
      return filteredItems;
    }
  }
}
