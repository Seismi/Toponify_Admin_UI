import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'smi-layouts-dropdown',
  templateUrl: './layouts-dropdown.component.html',
  styleUrls: ['./layouts-dropdown.component.scss']
})
export class LayoutsDropdownComponent {
  public layouts: ScopeDetails[];
  @Input() selectedLayout: ScopeDetails;

  @Input()
  set data(data: ScopeDetails[]) {
    this.layouts = data;
  }

  @Output() selectLayout = new EventEmitter<string>();

  onSelect(selectChange: MatSelectChange): void {
    this.selectLayout.emit(selectChange.value);
  }

}