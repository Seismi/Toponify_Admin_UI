import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'smi-search-table-view',
  templateUrl: './search-table-view.component.html',
  styleUrls: ['./search-table-view.component.scss']
})
export class SearchTableViewComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Output() search = new EventEmitter<string>();

  onSearch(filterValue: string): void {
    this.search.emit(filterValue);
  }
}
