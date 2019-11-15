import { Component, OnInit, HostListener, ViewChildren } from '@angular/core';
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

  @ViewChildren('inp') inp: any;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if(this.toggleSearch === true && event.key === 'Escape') {
      this.toggleSearch = false;
      this.inp.first.nativeElement.value = "";
    }
  }

  constructor(private searchStore: Store<SearchState>) {}

  ngOnInit(): void {}

  onSearch(text: string): void {
    this.search(text);
  }

  search(text: string): void {
    const queryParams = { text: text };
    this.searchStore.dispatch(new Search(queryParams));
    this.results$ = this.searchStore.pipe(select(getSearchResults));
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.inp.first.nativeElement.focus();
  }

  searchClose(): void {
    this.toggleSearch = false;
  }

}