import { Component, OnInit, HostListener } from '@angular/core';
import { SearchEntity } from '@app/core/store/models/search.models';
import { Observable } from 'rxjs';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public results$: Observable<SearchEntity[]>;
  
  public toggleSearch: boolean = false;

  public input: string;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.toggleSearch === true && event.key === 'Escape') {
      this.toggleSearch = false;
      this.input = null;
    }
  }

  constructor(private searchStore: Store<SearchState>) {}

  ngOnInit() {}

  onSearch(text: string) {
    this.search(text);
  }

  search(text: string) {
    const queryParams = { text: text };
    this.searchStore.dispatch(new Search(queryParams));
    this.results$ = this.searchStore.pipe(select(getSearchResults));
  }

  openSearch() {
    this.toggleSearch = true;
  }

  searchClose() {
    this.toggleSearch = false;
  }

}