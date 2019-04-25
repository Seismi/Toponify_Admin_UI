import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Output()
  search = new EventEmitter<string>();

  applyFilter(filterValue: string){
    this.search.emit(filterValue);
  }

}
