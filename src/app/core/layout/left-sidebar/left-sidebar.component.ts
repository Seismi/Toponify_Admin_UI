import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSideBarComponent {

  @Input() workPackageIsEditable = false;

  @Output()
  openWorkPackageTab = new EventEmitter();

  @Output()
  openEditTab = new EventEmitter();

  @Output()
  openAnalysisTab = new EventEmitter();

  openWorkPackage() {
    this.openWorkPackageTab.emit();
  }

  openEdit() {
    this.openEditTab.emit();
  }

  openAnalysis() {
    this.openAnalysisTab.emit();
  }
}