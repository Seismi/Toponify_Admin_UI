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
    switch (selectedSearch.objectType) {
      case ObjectType.radio: {
        this.router.navigate(['/radio', selectedSearch.id]);
        break;
      }
      case ObjectType.attribute: {
        const queryParams: { [key: string]: any } = {};
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/attributes-and-rules', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.report: {
        const queryParams: { [key: string]: any } = {};
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/report-library', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.workpackage: {
        const queryParams: { [key: string]: any } = {};
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/work-packages', selectedSearch.id], { queryParams });
        break;
      }
      case ObjectType.system_link:
      case ObjectType.system: {
        const queryParams: { [key: string]: any } = {
          filterLevel: 'system',
          selectedItem: selectedSearch.id,
          selectedType: selectedSearch.objectType === ObjectType.system_link ? 'link' : 'node'
        };
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/topology'], { queryParams });
        break;
      }
      case ObjectType.data_set_link:
      case ObjectType.data_set: {
        const queryParams: { [key: string]: any } = {
          filterLevel: 'data set',
          selectedItem: selectedSearch.id,
          selectedType: selectedSearch.objectType === ObjectType.data_set_link ? 'link' : 'node'
        };
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/topology'], { queryParams });
        break;
      }
      case ObjectType.dimension_link:
      case ObjectType.dimension: {
        const queryParams: { [key: string]: any } = {
          filterLevel: 'dimension',
          selectedItem: selectedSearch.id,
          selectedType: selectedSearch.objectType === ObjectType.dimension_link ? 'link' : 'node'
        };
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/topology'], { queryParams });
        break;
      }
      case ObjectType.reporting_concept_link:
      case ObjectType.reporting_concept: {
        const queryParams: { [key: string]: any } = {
          filterLevel: 'reporting concept',
          selectedItem: selectedSearch.id,
          selectedType: selectedSearch.objectType === ObjectType.reporting_concept_link ? 'link' : 'node'
        };
        if (selectedSearch.workPackage && selectedSearch.workPackage.id) {
          queryParams.workpackages = [selectedSearch.workPackage.id];
        }
        this.router.navigate(['/topology'], { queryParams });
        break;
      }
    }
    this.searchClose();
    this.searchStore.dispatch(new ClearSearch());
  }
}
