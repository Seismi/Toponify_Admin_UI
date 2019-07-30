import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSideBarComponent {

  @Input() workPackageIsEditable = false;
  @Input() hideTab = false;

  @Output()
  leftTab = new EventEmitter();

  onOpenLeftTab(i) {
    this.leftTab.emit(i);
  }

}