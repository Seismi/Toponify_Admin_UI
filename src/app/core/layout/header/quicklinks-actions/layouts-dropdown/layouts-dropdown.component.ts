import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { Store } from '@ngrx/store';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { LoadLayout } from '@app/layout/store/actions/layout.actions';

@Component({
  selector: 'smi-layouts-dropdown',
  templateUrl: './layouts-dropdown.component.html',
  styleUrls: ['./layouts-dropdown.component.scss']
})
export class LayoutsDropdownComponent implements OnInit {

  layouts: ScopeDetails[];

  @Input()
  set data(data: ScopeDetails[]) {
    this.layouts = data;
  }
  
  constructor(private store: Store<LayoutState>) {}

  ngOnInit() {
    this.store.dispatch(new LoadLayout('00000000-0000-0000-0000-000000000000'));
  }

  @Output()
  selectLayout = new EventEmitter();

  onSelect(id) {
    this.selectLayout.emit(id);
  }
}