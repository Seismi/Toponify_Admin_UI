import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSideBarComponent {

  @Input() objectSelected = false;

  @Output()
  rightTab = new EventEmitter();

  openRightTab(i) {
    this.rightTab.emit(i);
  }

}