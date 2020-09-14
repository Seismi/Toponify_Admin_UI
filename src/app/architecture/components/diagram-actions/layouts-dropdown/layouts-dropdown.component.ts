import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { State as ScopeState } from '@app/scope/store/reducers/scope.reducer';
import { SetPreferredLayout, UnsetPreferredLayout } from '@app/scope/store/actions/scope.actions';
import { ScopeService } from '@app/scope/services/scope.service';

@Component({
  selector: 'smi-layouts-dropdown',
  templateUrl: './layouts-dropdown.component.html',
  styleUrls: ['./layouts-dropdown.component.scss']
})
export class LayoutsDropdownComponent {
  public layouts;
  @Input() selectedLayout: ScopeDetails;
  @Input() allowSave: boolean;
  @Input() scope: ScopeDetails;

  @Input()
  set data(data: ScopeDetails[]) {
    this.layouts = data;
  }

  @Output() selectLayout = new EventEmitter<string>();
  @Output() addLayout = new EventEmitter<void>();

  constructor(private store: Store<ScopeState>, private scopeService: ScopeService) { }

  onSelect(selectChange: MatSelectChange): void {
    this.selectLayout.emit(selectChange.value);
  }

  getLabel(): string {
    return this.selectedLayout ? this.selectedLayout.name.toString() : null;
  }

  setPreferredLayout(layoutId: string): void {
    this.store.dispatch(new SetPreferredLayout({ scopeId: this.scope.id, layoutId: layoutId }));
    this.scopeService.updateScope(this.scope.id, { ...this.scope, defaultLayout: layoutId }).subscribe();
  }

  unsetPreferredLayout(): void {
    this.store.dispatch(new UnsetPreferredLayout({ scopeId: this.scope.id }));
  }

}
