import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchEntity } from '@app/core/store/models/search.models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  results: SearchEntity[];

  @Input()
  set data(data: any[]) {
    this.results = data
  }

  constructor() {}

  ngOnInit() {}

  @Output()
  search = new EventEmitter<string>();

  applyFilter(filterValue: string){
    this.search.emit(filterValue);
  }

}
