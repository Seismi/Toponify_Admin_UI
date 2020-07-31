import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ScopeEntity, defaultScopeId } from '@app/scope/store/models/scope.model';
import { MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { SetScopeAsFavourite, UnsetScopeAsFavourite } from '@app/scope/store/actions/scope.actions';

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

  constructor(private store: Store<ScopeState>) { }

  ngOnInit() { }

  onSelect(selectChange: MatSelectChange): void {
    this.selectScope.emit(selectChange.value);
  }

  unsetFavourite(scope: ScopeEntity): void {
    this.store.dispatch(new UnsetScopeAsFavourite(scope.id));
  }

  setFavourite(scope: ScopeEntity): void {
    this.store.dispatch(new SetScopeAsFavourite(scope.id));
  }

  getLabel(): string {
    return this.selectedScope ? this.selectedScope.name.toString() : null;
  }

}
