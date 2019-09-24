import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { Level } from '../services/diagram-level.service';

@Pipe({ name: 'layer' })
export class LayerPipe implements PipeTransform {
  constructor(public filterService: FilterService) {}

  transform(items: any[], props?: any): any {
    // Lets get url filters
    const filter = this.filterService.getFilter();
    if (!filter) {
      return items;
    }

    if (!items || items.length < 1) {
      return [];
    }

    const { filterLevel, id } = filter;

    // If current layer map or usage, do not filter
    if ([Level.map, Level.usage].includes(filterLevel)) {
      return items;
    } else {
      const filteredItems = items.filter(
        item => item.layer === filterLevel.toLowerCase()
      );
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
