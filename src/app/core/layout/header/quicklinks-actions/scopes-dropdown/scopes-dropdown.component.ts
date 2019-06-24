import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeEntity } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-scopes-dropdown',
  templateUrl: './scopes-dropdown.component.html',
  styleUrls: ['./scopes-dropdown.component.scss']
})
export class ScopesDropdownComponent {

  scopes: any[];

  @Input()
  set data(data: ScopeEntity[]) {
    this.scopes = data;
  }

  @Output()
  selectScope = new EventEmitter();

  onSelect(id) {
    this.selectScope.emit(id);
  }

}