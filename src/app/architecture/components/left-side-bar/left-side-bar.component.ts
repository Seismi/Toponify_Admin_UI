import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent {

  @Input() workPackageIsEditable = false;

  @Output()
  leftTab = new EventEmitter();

  openLeftTab(i) {
    this.leftTab.emit(i);
  }
}