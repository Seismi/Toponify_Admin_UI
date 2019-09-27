import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'smi-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSideBarComponent {
  @Input() workPackageIsEditable = false;
  @Input() hideTab = false;

  @Output() leftTab = new EventEmitter<number>();

  openLeftTab(i: number) {
    this.leftTab.emit(i);
  }
}
