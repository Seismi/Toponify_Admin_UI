import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScopeEntity } from '@app/scope/store/models/scope.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'smi-scopes-dropdown',
  templateUrl: './scopes-dropdown.component.html',
  styleUrls: ['./scopes-dropdown.component.scss']
})
export class ScopesDropdownComponent {
  public scopes: ScopeEntity[];
  @Input() selectedScope: ScopeEntity;

  @Input()
  set data(data: ScopeEntity[]) {
    this.scopes = data;
  }

  @Output() selectScope = new EventEmitter<string>();

  onSelect(selectChange: MatSelectChange) {
    this.selectScope.emit(selectChange.value);
  }
}
