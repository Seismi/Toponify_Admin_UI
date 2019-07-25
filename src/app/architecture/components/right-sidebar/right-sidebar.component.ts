import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smi-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSideBarComponent {

  tabs = ['Details', 'Attributes', 'Properties', 'RADIO', 'Work Packages']

  @Output()
  rightTab = new EventEmitter();

  openRightTab(i) {
    this.rightTab.emit(i);
  }

}