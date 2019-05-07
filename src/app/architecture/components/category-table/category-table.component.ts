import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss']
})
export class CategoryTableComponent implements OnInit {

  selectedRowIndex = -1;

  _data: any[] = [];

  @Input()
  set data(data: any[]) {
    // Make sure, data is not linked
    if (data) {
      this._data = JSON.parse(JSON.stringify(data));
    }
  }

  // FIXME: categories could be {title: 'Title', value: 'title'}[]
  @Input() categories: string[] = [];

  @Output()
  selectRow = new EventEmitter();

  ngOnInit() {}

  getTransformedData(category?: string): any[] {
    const data = category
      ? this.filterByCategory(this._data, category)
      : this._data;
    return this.setCollapsed(data);
  }

  // TODO: Question. Do we need filter only top level, or should be deep filtering. ???
  filterByCategory(
    data: any[],
    category: string,
    nested: boolean = false
  ): any[] {
    return data
      .filter(item => {
        return item.category === category;
      })
      .map(item => {
        if (nested && item.related.length > 0) {
          item.related = this.filterByCategory(item.related, category);
        }

        return item;
      });
  }

  setCollapsed(data: any[], level = 1): any[] {
    return data.map(item => {
      if (typeof item.collapsed === 'undefined') {
        item.collapsed = true;
      }
      item.level = level;
      if (item.related.length > 0) {
        item.related = this.setCollapsed(item.related, level + 1);
      }
      return item;
    });
  }

  onSelectRow(entry) {
    this.selectRow.emit(entry);
    this.selectedRowIndex = entry.id;
  }
}
