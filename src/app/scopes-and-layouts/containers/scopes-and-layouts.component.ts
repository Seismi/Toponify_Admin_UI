import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScopeEntity, ScopeEntitiesHttpParams, Page } from '@app/scope/store/models/scope.model';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadScopes, AddScope, SetScopeAsFavourite, UnsetScopeAsFavourite } from '@app/scope/store/actions/scope.actions';
import { getScopeEntities, getScopePage } from '@app/scope/store/selectors/scope.selector';
import { ScopeAndLayoutModalComponent } from './scope-and-layout-modal/scope-and-layout-modal.component';
import { MatDialog } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'smi-scopes-and-layouts-component',
  templateUrl: 'scopes-and-layouts.component.html',
  styleUrls: ['scopes-and-layouts.component.scss']
})
export class ScopesAndLayoutsComponent implements OnInit {
  public scopes$: Observable<ScopeEntity[]>;
  private scopeParams: ScopeEntitiesHttpParams = {
    textFilter: '',
    page: 0,
    size: 5
  };
  search$ = new Subject<string>();
  page$: Observable<Page>;

  constructor(
    private store: Store<ScopeState>,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadScopes(this.scopeParams));
    this.scopes$ = this.store.pipe(select(getScopeEntities));

    this.search$
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(textFilter => {
      this.scopeParams = {
        textFilter: textFilter,
        page: 0,
        size: this.scopeParams.size,
        ...(this.scopeParams.sortBy && { sortBy: this.scopeParams.sortBy }),
        ...(this.scopeParams.sortOrder && { sortOrder: this.scopeParams.sortOrder })
      };
      this.store.dispatch(new LoadScopes(this.scopeParams));
    });

    this.page$ = this.store.pipe(select(getScopePage));
  }

  onScopeSelect(row: ScopeEntity): void {
    this.router.navigate(['scopes-and-layouts', row.id], { queryParamsHandling: 'preserve' });
  }

  onSearch(textFilter: string): void {
    this.search$.next(textFilter);
  }

  onPageChange(page) {
    this.scopeParams = {
      textFilter: this.scopeParams.textFilter,
      page: page.pageIndex,
      size: page.pageSize,
      ...(this.scopeParams.sortBy && { sortBy: this.scopeParams.sortBy }),
      ...(this.scopeParams.sortOrder && { sortOrder: this.scopeParams.sortOrder })
    };
    this.store.dispatch(new LoadScopes(this.scopeParams));
  }

  refreshSearch(textFilter: string): void {
    this.scopeParams = {
      textFilter: textFilter,
      page: 0,
      size: this.scopeParams.size,
      ...(this.scopeParams.sortBy && { sortBy: this.scopeParams.sortBy }),
      ...(this.scopeParams.sortOrder && { sortOrder: this.scopeParams.sortOrder })
    };
    this.store.dispatch(new LoadScopes(this.scopeParams));
  }

  onAddScope(): void {
    const dialogRef = this.dialog.open(ScopeAndLayoutModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Scope'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.scopeAndLayout) {
        this.store.dispatch(
          new AddScope({
            id: data.scopeAndLayout.id,
            name: data.scopeAndLayout.name,
            layerFilter: 'system'
          })
        );
      }
    });
  }

  setScopeAsFavorite(scopeId: string): void {
    this.store.dispatch(new SetScopeAsFavourite(scopeId));
  }

  unsetScopeAsFavorite(scopeId: string): void {
    this.store.dispatch(new UnsetScopeAsFavourite(scopeId));
  }

  handleTableSortChange(sort: { sortOrder: string; sortBy: string }) {
    this.scopeParams = {
      textFilter: this.scopeParams.textFilter,
      page: this.scopeParams.page,
      size: this.scopeParams.size,
      ...(sort.sortOrder && { sortBy: sort.sortBy, sortOrder: sort.sortOrder })
    };
    this.store.dispatch(new LoadScopes(this.scopeParams));
  }

}
