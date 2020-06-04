import { Injectable } from '@angular/core';
import { RadiosAdvancedSearch } from '../store/models/radio.model';

interface FilterData {
  [key: string]: any;
}

@Injectable()
export class RadioFilterService {
  constructor() {}

  isFilterEnabled(filter: string | boolean | [] | number): boolean {
    if (Array.isArray(filter) && filter.length === 0) {
      return false;
    }
    if (Number.isInteger(filter as any)) {
      return true;
    }
    return !!filter;
  }

  transformFilterIntoAdvancedSearchData(data: FilterData, disabled: string[] = []): RadiosAdvancedSearch {
    return {
      status: {
        enabled: this.isFilterEnabled(data.status),
        values: data.status
      },
      type: {
        enabled: this.isFilterEnabled(data.type),
        values: data.type
      },
      assignedTo: {
        enabled: this.isFilterEnabled(data.assignedTo),
        values: data.assignedTo
      },
      relatesTo: {
        enabled: this.isFilterEnabled(data.relatesTo),
        includeDescendants: this.isFilterEnabled(data.relatesTo),
        includeLinks: this.isFilterEnabled(data.relatesTo),
        values: data.relatesTo
      },
      dueDate: {
        enabled: this.isFilterEnabled(data.from) || this.isFilterEnabled(data.to),
        from: data.from,
        to: data.to
      },
      text: {
        enabled: this.isFilterEnabled(data.text),
        value: data.text
      },
      severityRange: {
        enabled: !disabled.includes('severityRange') && this.isFilterEnabled(data.severityRange),
        from: data.severityRange && data.severityRange.from ? data.severityRange.from : 0,
        to: data.severityRange && data.severityRange.to ? data.severityRange.to : 0
      },
      frequencyRange: {
        enabled: !disabled.includes('frequencyRange') && this.isFilterEnabled(data.frequencyRange),
        from: data.frequencyRange && data.frequencyRange.from ? data.frequencyRange.from : 0,
        to: data.frequencyRange && data.frequencyRange.to ? data.frequencyRange.to : 0
      }
    };
  }
}
