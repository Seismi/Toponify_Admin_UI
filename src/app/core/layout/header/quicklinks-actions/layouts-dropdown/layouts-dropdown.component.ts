import { Component, Input } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-layouts-dropdown',
  templateUrl: './layouts-dropdown.component.html',
  styleUrls: ['./layouts-dropdown.component.scss']
})
export class LayoutsDropdownComponent {

  layouts: ScopeDetails[];

  @Input()
  set data(data: ScopeDetails[]) {
    this.layouts = data;
  }
  
}