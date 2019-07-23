import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'smi-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
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