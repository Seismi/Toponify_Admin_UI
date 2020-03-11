import { Component, HostListener, OnInit, ViewChildren } from '@angular/core';
import { ObjectType, SearchEntity } from '@app/core/store/models/search.models';
import { Observable, Subject } from 'rxjs';
import { State as SearchState } from '@app/core/store/reducers/search.reducer';
import { ClearSearch, Search } from '@app/core/store/actions/search.actions';
import { getSearchResults } from '@app/core/store/selectors/search.selectors';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public results$: Observable<SearchEntity[]>;
  private search$ = new Subject<string>();

  public toggleSearch = false;

  @ViewChildren('inp') inp: any;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (this.toggleSearch === true && event.key === 'Escape') {
      this.toggleSearch = false;
      this.inp.first.nativeElement.value = '';
    }
  }

  constructor(private searchStore: Store<SearchState>, private router: Router) {}

  ngOnInit(): void {
    this.results$ = this.searchStore.pipe(select(getSearchResults));
    this.search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.searchStore.dispatch(new Search({ text: searchTerm }));
      });
  }

  onSearch(text: string): void {
    this.search$.next(text);
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.inp.first.nativeElement.focus();
  }

  searchClose(): void {
    this.toggleSearch = false;
    this.inp.first.nativeElement.value = '';
  }

  onSelect(selectedSearch: SearchEntity) {
    const queryParams: { [key: string]: any } = {};
    if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
      queryParams.workpackages = [selectedSearch.workPackage.id];
    }
    switch (selectedSearch.objectType) {
      case ObjectType.radio: {
        this.router.navigate(['/radio', selectedSearch.id]);
        break;
      }
      case ObjectType.attribute: {
        this.router.navigate(['/attributes-and-rules', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.report: {
        this.router.navigate(['/report-library', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.workpackage: {
        this.router.navigate(['/work-packages', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.system_link:
      case ObjectType.system: {
        queryParams.filterLevel = 'system';
        queryParams.selectedItem = selectedSearch.id;
        queryParams.selectedType = selectedSearch.objectType === ObjectType.system_link ? 'link' : 'node';
        this.goToTopology(queryParams);
        break;
      }
      case ObjectType.data_set_link:
      case ObjectType.data_set: {
        queryParams.filterLevel = 'data set';
        queryParams.selectedItem = selectedSearch.id;
        queryParams.selectedType = selectedSearch.objectType === ObjectType.data_set_link ? 'link' : 'node';
        this.goToTopology(queryParams);
        break;
      }
      case ObjectType.dimension_link:
      case ObjectType.dimension: {
        queryParams.filterLevel = 'dimension';
        queryParams.selectedItem = selectedSearch.id;
        queryParams.selectedType = selectedSearch.objectType === ObjectType.dimension_link ? 'link' : 'node';
        this.goToTopology(queryParams);
        break;
      }
      case ObjectType.reporting_concept_link:
      case ObjectType.reporting_concept: {
        queryParams.filterLevel = 'reporting concept';
        queryParams.selectedItem = selectedSearch.id;
        queryParams.selectedType = selectedSearch.objectType === ObjectType.reporting_concept_link ? 'link' : 'node';
        this.goToTopology(queryParams);
        break;
      }
    }
    this.searchClose();
    this.searchStore.dispatch(new ClearSearch());
  }

  goToTopology(queryParams: { [key: string]: any }) {
    this.router.navigate(['/topology'], { queryParams });
  }
}
