import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ScopeEntity, defaultScopeId } from '@app/scope/store/models/scope.model';
import { MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { UnsetScopeAsFavourite, SetScopeAsFavourite, LoadScopes, LoadScope, ScopeActionTypes } from '@app/scope/store/actions/scope.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'smi-scopes-dropdown',
  templateUrl: './scopes-dropdown.component.html',
  styleUrls: ['./scopes-dropdown.component.scss']
})
export class ScopesDropdownComponent implements OnInit {
  public defaultScopeId = defaultScopeId;
  public scopes: ScopeEntity[];
  @Input() selectedScope: ScopeEntity;

  @Input()
  set data(data: ScopeEntity[]) {
    this.scopes = data;
  }

  @Output() selectScope = new EventEmitter<string>();

  constructor(
    private actions: Actions,
    private store: Store<ScopeState>
  ) { }

  ngOnInit() {
    this.actions
      .pipe(
        ofType(
          ScopeActionTypes.UnsetScopeAsFavouriteSuccess,
          ScopeActionTypes.SetScopeAsFavouriteSuccess
        )
      )
      .subscribe(_ => {
        this.store.dispatch(new LoadScopes({}));
        this.store.dispatch(new LoadScope(this.selectedScope.id));
      });
  }

  onSelect(selectChange: MatSelectChange): void {
    this.selectScope.emit(selectChange.value);
  }

  unsetFavourite($event, scope: ScopeEntity): void {
    $event.stopPropagation();
    this.store.dispatch(new UnsetScopeAsFavourite(scope.id));
  }

  setFavourite($event, scope: ScopeEntity): void {
    $event.stopPropagation();
    this.store.dispatch(new SetScopeAsFavourite(scope.id));
  }

  getLabel(): string {
    return this.selectedScope ? this.selectedScope.name.toString() : null;
  }

}
