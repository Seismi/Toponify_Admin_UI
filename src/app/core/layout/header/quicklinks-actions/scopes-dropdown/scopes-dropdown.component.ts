import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { Store } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { LoadScope } from '@app/scope/store/actions/scope.actions';

@Component({
  selector: 'smi-scopes-dropdown',
  templateUrl: './scopes-dropdown.component.html',
  styleUrls: ['./scopes-dropdown.component.scss']
})
export class ScopesDropdownComponent implements OnInit {

  scopes: ScopeEntity[];
  selected = 'Default';

  @Input()
  set data(data: ScopeEntity[]) {
    this.scopes = data;
  }

  constructor(private store: Store<ScopeState>) {}

  ngOnInit() {
    this.store.dispatch(new LoadScope('00000000-0000-0000-0000-000000000000'));
  }

  @Output()
  selectScope = new EventEmitter();

  onSelect(id) {
    this.selectScope.emit(id);
  }
}