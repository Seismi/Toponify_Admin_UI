import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-layouts-dropdown',
  templateUrl: './layouts-dropdown.component.html',
  styleUrls: ['./layouts-dropdown.component.scss']
})
export class LayoutsDropdownComponent {
  selected: string = 'Default Layout';
  layouts: ScopeDetails[];

  @Input()
  set data(data: ScopeDetails[]) {
    this.layouts = data;
  }

  @Output() selectLayout = new EventEmitter<string>();

  onSelect(id) {
    this.selectLayout.emit(id);
  }

}