import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-left-hand-pane',
  templateUrl: './left-hand-pane.component.html',
  styleUrls: ['./left-hand-pane.component.scss']
})
export class LeftHandPaneComponent {
  @Input() workPackageIsEditable: boolean;
  @Input() selectedLeftTab: number;
  @Output() openSideBar = new EventEmitter<number | string>();
  @Input() sideNavActions: boolean = false;
  @Input() architecturePage: boolean = false;

  onOpenSideBar(): void {
    let index: number;
    (!this.workPackageIsEditable) ? index = 1 : index = 2;
    this.openSideBar.emit(index);
  }
}