import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { Level } from '../services/diagram-level.service';

@Pipe({name: 'layer'})
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

    const {filterLevel, id} = filter;

    // If current layer map, do not filter
    if (filterLevel === Level.map) {
      return items;
    } else {
      let filteredItems = [];
      filteredItems = items.filter(item => item.layer === filterLevel.toLowerCase());
      // Sorting by id is optional
      if ( props && props.byId && id ) {
        const parentNode = items.find(item => item.id === id);
        const childNodeIds = parentNode.descendants.map(item => item.id);
        return filteredItems.filter(item => childNodeIds.includes(item.id));
      }
      return filteredItems;
    }
  }
}
