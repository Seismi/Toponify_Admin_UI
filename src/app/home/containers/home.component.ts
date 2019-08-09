import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { SearchEntity } from '@app/core/store/models/search.models';

@Component({
  selector: 'smi-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {

  search$: Observable<SearchEntity[]>;

  constructor(private searchStore: Store<SearchState>) { }

  ngOnInit() {}

  onSearch(query: string) {
    this.search(query);
  }

  search(text: string) {
    const queryParams = {
      text: text
    };

    this.searchStore.dispatch(new Search(queryParams));
    this.search$ = this.searchStore.pipe(select(getSearchResults));
  }

}